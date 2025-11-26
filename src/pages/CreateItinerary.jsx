import { useState, useRef } from "react";
import CustomerForm from "../components/CustomerForm";
import DayList from "../components/DayList";
import PdfTemplate from "../components/PdfTemplate"; 
import { supabase } from "../lib/supabaseClient";
import html2pdf from "html2pdf.js";
import { Save, Download, Plus, Calendar, User, FileText } from "lucide-react";
import toast from "react-hot-toast"; 

const CreateItinerary = () => {
  const [customerDetails, setCustomerDetails] = useState({
    customer_name: "",
    persons: "",
    hotel_category: "",
    hotel_name: "",
    rooms: "",
    vehicle: "",
    cost_before: "",
    final_cost: ""
  });

  const [days, setDays] = useState([]);  // it contain array of day objects.
  const pdfRef = useRef(null);

  const addDay = () => {
    setDays([...days, { id: Date.now(), title: "", description: "" }]);
  };

  const handleSave = async () => {
    // 1. Basic Validation
    const trimmed = customerDetails.customer_name.trim();
    if (!trimmed) {
      toast.error("Please enter a customer name"); 
      return;
    }

    // ✅ 2. STRICT VALIDATION: Check numbers before saving
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

    // 3. Show Loading Toast
    const toastId = toast.loading("Saving itinerary..."); 

    const { data, error } = await supabase
      .from("itineraries")
      .insert([
        {
          customer_name: trimmed,
          details: customerDetails,
          itinerary: days,
          total_cost: customerDetails.final_cost
        }
      ]);

    // 4. Handle Result
    if (error) {
      console.error("Supabase Error:", error);
      toast.error("Failed to save itinerary", { id: toastId });
    } else {
      toast.success("Itinerary saved successfully!", { id: toastId });
      console.log("Inserted row:", data);
      
      // Optional: Reset form or redirect
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfRef.current) return;

    // Toast for PDF generation start
    const promise = html2pdf()
      .set({
        margin: 10,
        filename: `${customerDetails.customer_name || "itinerary"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(pdfRef.current)
      .save();

    toast.promise(promise, {
      loading: 'Generating PDF...',
      success: 'PDF Downloaded!',
      error: 'Failed to generate PDF',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      
      {/* 1. Page Header */}
      <div className="bg-teal-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-teal-200" /> 
            New Itinerary
          </h1>
          <p className="mt-2 text-teal-100">
            Draft a new travel plan for your customers.
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
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 justify-end items-center">
          <span className="text-sm text-slate-500 hidden sm:block mr-auto">
            Total Cost: <span className="font-bold text-slate-900">{customerDetails.final_cost || "₹0"}</span>
          </span>
          
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            Preview PDF
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800 shadow-sm active:scale-95 transition-all"
          >
            <Save size={18} />
            Save Itinerary
          </button>
        </div>
      </div>

      <PdfTemplate 
        ref={pdfRef} 
        customerDetails={customerDetails} 
        days={days} 
      />

    </div>
  );
};

export default CreateItinerary;