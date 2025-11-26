import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Trash2, Edit, Plus, Calendar, Folder, Download, Loader2 } from "lucide-react";
import PdfTemplate from "../components/PdfTemplate";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast"; 

function SavedItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedPdf, setSelectedPdf] = useState(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*") 
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load itineraries");
    } else {
      setItineraries(data);
    }
    setLoading(false);
  };

  // ✅ 1. The ACTUAL Delete Logic (runs only after confirmation)
  const confirmDelete = async (id) => {
    const toastId = toast.loading("Deleting itinerary...");

    try {
      const { error } = await supabase.from("itineraries").delete().eq("id", id);
      if (error) throw error;

      // Update UI
      setItineraries((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully", { id: toastId });
    
    } catch (err) {
      toast.error("Error deleting item", { id: toastId });
    }
  };

  // ✅ 2. The Trigger: Shows a Custom Toast instead of window.confirm
  const handleDelete = (id, name) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <div>
          
          <p className="text-sm text-slate-500">
            Are you sure you want to delete <span className="font-medium text-slate-800">{name}</span>?
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id); // Close the confirmation
              confirmDelete(id);   // Run the delete
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000, // Stay open for 6 seconds
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        padding: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      icon: '⚠️',
    });
  };

  const handleDownload = (item) => {
    setSelectedPdf(item);

    setTimeout(() => {
      if (!pdfRef.current) return;

      const promise = html2pdf()
        .set({
          margin: 10,
          filename: `${item.customer_name || "itinerary"}.pdf`,
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

    }, 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" /> Loading trips...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Saved Itineraries</h1>
            <p className="text-slate-500 mt-1">Manage and download your travel plans.</p>
          </div>
          <Link 
            to="/"
            className="bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-800 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} /> Create New
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 p-4 rounded-full inline-flex mb-4">
              <Folder size={40} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No itineraries found</h3>
            <Link to="/" className="text-teal-700 font-medium hover:underline mt-2 inline-block">
              Create your first itinerary &rarr;
            </Link>
          </div>
        ) : (
          /* ✅ REFINED CLEAN CARD LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group relative"
              >
                <div className="p-5 flex flex-col h-full">
                  
                  {/* 1. TOP ROW: Icon + Title + Price */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Icon */}
                      <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                        <Folder size={20} />
                      </div>
                      {/* Title */}
                      <h3 
                        className="font-bold text-slate-900 text-lg truncate" 
                        title={item.customer_name}
                      >
                        {item.customer_name}
                      </h3>
                    </div>

                    {/* Price Badge */}
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-sm shrink-0 ml-2">
                      ₹{item.total_cost ? Number(item.total_cost).toLocaleString() : "0"}
                    </span>
                  </div>

                  {/* 2. MIDDLE ROW: Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 pl-13"> 
                     {/* pl-13 aligns date with text, ignoring icon width */}
                    <Calendar size={14} className="text-slate-400" />
                    <span>
                      {new Date(item.created_at).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    
                    {/* Left: Actions (Clean Gray Icons) */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.customer_name)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Right: Edit Button (Softer Teal Outline) */}
                    <Link
                      to={`/edit/${item.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      Edit Plan
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hidden PDF Template */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <PdfTemplate 
            ref={pdfRef} 
            customerDetails={selectedPdf?.details} 
            days={selectedPdf?.itinerary || []} 
          />
        </div>

      </div>
    </div>
  );
}

export default SavedItineraries;