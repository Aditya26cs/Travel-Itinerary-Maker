import { MapPin } from "lucide-react";
import DayItem from "./DayItem";

function DayList({ days, setDays }) {
  
  const updateDay = (id, key, value) => {
    setDays(days.map((day) => 
      day.id === id ? { ...day, [key]: value } : day
    ));
  };

  const deleteDay = (id) => {
    setDays(days.filter(day => day.id !== id));
  };

  // Modern Empty State
  if (days.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <div className="bg-white p-4 rounded-full inline-flex mb-3 shadow-sm">
          <MapPin size={32} className="text-teal-200" />
        </div>
        <h3 className="text-slate-900 font-medium">No days added yet</h3>
        <p className="text-slate-500 text-sm mt-1">Start building your itinerary by adding a day below.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Optional: Vertical Timeline Line (Visual only) */}
      <div className="absolute left-4 md:left-8 top-4 bottom-4 w-0.5 bg-slate-200 -z-10 hidden md:block"></div>

      {days.map((day, index) => (
        <DayItem
          key={day.id}
          day={day}
          index={index} // Passing index for "Day 1" numbering
          updateDay={updateDay}
          deleteDay={deleteDay}
        />
      ))}
    </div>
  );
}

export default DayList;