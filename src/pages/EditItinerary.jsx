import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import CustomerForm from "../components/CustomerForm";
import DayList from "../components/DayList";
import PdfTemplate from "../components/PdfTemplate"; // ✅ Reusing the shared PDF component
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast"; // ✅ 1. Import Toast
import { 
  Save, Copy, Download, ArrowLeft, Loader2, 
  User, Calendar, Plus, Edit3 
} from "lucide-react";

function EditItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef(null);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      toast.error("Error loading itinerary"); // ✅ Toast Error
      navigate("/saved");
    } else {
      setCustomerDetails(data.details);
      setDays(data.itinerary || []);
    }
    setLoading(false);
  };

  // ✅ Added: Function to add days to an existing plan
  const addDay = () => {
    setDays([...days, { id: Date.now(), title: "", description: "" }]);
  };

  const handleUpdate = async () => {
    const trimmed = customerDetails.customer_name.trim();
    if (!trimmed) {
      toast.error("Customer name is required");
      return;
    }

    // ✅ VALIDATION: Strict check before sending to database
    if (Number(customerDetails.persons) <= 0) {
      toast.error("Number of persons must be at least 1");
      return;
    }
    if (Number(customerDetails.rooms) <= 0) {
      toast.error("Number of rooms must be at least 1");
      return;
    }
    if (Number(customerDetails.final_cost) < 0) {
      toast.error("Final cost cannot be negative");
      return;
    }

    // ✅ Start loading toast
    const toastId = toast.loading("Updating itinerary...");

    const { error } = await supabase
      .from("itineraries")
      .update({
        customer_name: trimmed,
        details: customerDetails,
        itinerary: days,
        total_cost: customerDetails.final_cost,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Failed to update itinerary", { id: toastId });
    } else {
      toast.success("Updated successfully!", { id: toastId });
      navigate("/saved");
    }
  };

  const handleSaveNew = async () => {
    const trimmed = customerDetails.customer_name.trim();

    // ✅ VALIDATION: Strict check for Save Copy as well
    if (Number(customerDetails.persons) <= 0) {
      toast.error("Number of persons must be at least 1");
      return;
    }
    if (Number(customerDetails.rooms) <= 0) {
      toast.error("Number of rooms must be at least 1");
      return;
    }
    if (Number(customerDetails.final_cost) < 0) {
      toast.error("Final cost cannot be negative");
      return;
    }

    const newName = `${trimmed} (Copy)`;
    
    // ✅ Start loading toast
    const toastId = toast.loading("Saving copy...");

    const { error } = await supabase
      .from("itineraries")
      .insert([
        {
          customer_name: newName,
          details: { ...customerDetails, customer_name: newName },
          itinerary: days,
          total_cost: customerDetails.final_cost,
        },
      ]);

    if (error) {
      console.error(error);
      toast.error("Could not save copy", { id: toastId });
    } else {
      toast.success("Saved as new itinerary!", { id: toastId });
      navigate("/saved");
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfRef.current) return;

    // ✅ Toast for PDF generation
    const promise = html2pdf()
      .set({
        margin: 10,
        filename: `${customerDetails.customer_name || "itinerary"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRef.current)
      .save();

    toast.promise(promise, {
      loading: 'Generating PDF...',
      success: 'PDF Downloaded!',
      error: 'Failed to generate PDF',
    });
  };

  // Modern Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" /> Loading itinerary...
      </div>
    </div>
  );

  if (!customerDetails) return <p className="p-8 text-center">Itinerary not found.</p>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      
      {/* 1. Header with Back Button */}
      <div className="bg-teal-700 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/saved" className="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={18} /> Back to Saved Trips
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Edit3 className="text-teal-200" /> 
            Edit Itinerary
          </h1>
          <p className="mt-2 text-teal-100">
            Modifying details for <span className="font-semibold text-white">{customerDetails.customer_name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 space-y-8">
        
        {/* 2. Customer Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <User size={20} className="text-teal-700" />
            <h2 className="font-semibold text-slate-800">Customer Information</h2>
          </div>
          <div className="p-6">
            <CustomerForm data={customerDetails} setData={setCustomerDetails} />
          </div>
        </div>

        {/* 3. Itinerary Timeline Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <Calendar size={20} className="text-teal-700" />
            <h2 className="font-semibold text-slate-800">Day-by-Day Schedule</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <DayList days={days} setDays={setDays} />

            {/* Add Day Button (Was missing in original code) */}
            <button
              onClick={addDay}
              className="w-full border-2 border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="bg-slate-100 rounded-full p-1 group-hover:bg-teal-100 transition-colors">
                <Plus size={20} />
              </div>
              <span className="font-medium">Add Day {days.length + 1}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3 justify-end items-center">
          
           {/* Cost Display */}
           <span className="text-sm text-slate-500 mr-auto hidden md:block">
            Total Cost: <span className="font-bold text-slate-900">{customerDetails.final_cost || "₹0"}</span>
          </span>

          {/* Buttons */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
              title="Download PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={handleSaveNew}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition-colors text-sm"
              title="Save as a new copy"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Save Copy</span>
              <span className="sm:hidden">Copy</span>
            </button>

            <button
              onClick={handleUpdate}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800 shadow-sm active:scale-95 transition-all text-sm"
            >
              <Save size={16} />
              Update
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 5. Reusable PDF Component */}
      <PdfTemplate 
        ref={pdfRef} 
        customerDetails={customerDetails} 
        days={days} 
      />

    </div>
  );
}

export default EditItinerary;