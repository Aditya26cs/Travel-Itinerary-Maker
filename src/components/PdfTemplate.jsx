import { forwardRef } from "react";

const PdfTemplate = forwardRef(({ customerDetails, days }, ref) => {
  if (!customerDetails) return null;

  // Standard Hex colors that html2pdf can understand
  const styles = {
    page: { backgroundColor: "#ffffff", color: "#0f172a" }, // slate-900
    headerTitle: { color: "#115e59" }, // teal-800
    sectionTitle: { color: "#334155", borderBottom: "1px solid #e2e8f0" }, // slate-700, slate-200
    label: { color: "#475569" }, // slate-600
    card: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }, // white, slate-200
    badge: { backgroundColor: "#0f766e", color: "#ffffff" }, // teal-700, white
    text: { color: "#334155" }, // slate-700
    subtext: { color: "#64748b" }, // slate-500
    bgGray: { backgroundColor: "#f8fafc", border: "1px solid #cbd5e1" } // slate-50, slate-300
  };

  return (
    <div className="hidden">
      <div 
        ref={ref} 
        className="w-[800px] mx-auto text-sm font-sans p-8"
        style={styles.page} // Force white bg and dark text
      >
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <img
            src="/mathura-header.jpg"
            alt="Mathura"
            style={{ width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "8px" }}
          />
          <h2 
            className="text-2xl font-bold mt-4 uppercase tracking-wide"
            style={styles.headerTitle}
          >
            Mathura – Vrindavan Travel Itinerary
          </h2>
        </div>

        {/* CUSTOMER DETAILS TABLE */}
        <div className="rounded-lg p-5 mb-6" style={styles.bgGray}>
          <h3 className="font-bold text-lg mb-4 pb-2" style={styles.sectionTitle}>
            Trip Details
          </h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <p><strong style={styles.label}>Customer Name:</strong> {customerDetails.customer_name}</p>
            <p><strong style={styles.label}>Total Persons:</strong> {customerDetails.persons}</p>
            <p><strong style={styles.label}>Hotel Category:</strong> {customerDetails.hotel_category}</p>
            <p><strong style={styles.label}>Vehicle:</strong> {customerDetails.vehicle}</p>
            <p><strong style={styles.label}>Rooms:</strong> {customerDetails.rooms}</p>
            <p><strong style={styles.label}>Hotel:</strong> {customerDetails.hotel_name || "TBD"}</p>
            <p><strong style={styles.label}>Total Cost:</strong> ₹{customerDetails.final_cost}</p>
          </div>
        </div>

        {/* DAY-WISE ITINERARY */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg mb-2" style={styles.text}>Day-wise Schedule</h3>
          {days.map((day, index) => (
            <div
              key={day.id}
              className="rounded-lg p-4 break-inside-avoid"
              style={styles.card}
            >
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={styles.badge}
                >
                  Day {index + 1}
                </span>
                <p className="font-bold text-base" style={styles.page}>
                  {day.title || "Untitled Day"}
                </p>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-sm" style={styles.text}>
                {day.description}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <img
            src="/vrindavan-footer.jpg"
            alt="Vrindavan"
            style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px" }}
          />
          <p className="text-xs mt-3" style={styles.subtext}>
            Thank you for choosing us for your spiritual journey.
          </p>
        </div>
      </div>
    </div>
  );
});

export default PdfTemplate;