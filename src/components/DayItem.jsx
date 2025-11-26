import { Trash2, Map, AlignLeft } from "lucide-react";

function DayItem({ day, index, updateDay, deleteDay }) {
  return (
    <div className="group relative flex gap-4 md:gap-6 items-start animate-fade-in">
      
      {/* 1. Timeline Marker (The Circle with the Number) */}
      {/* Note: This visually connects the days like a journey */}
      <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-100 border-2 border-white shadow-sm flex items-center justify-center z-10 mt-2">
        <span className="text-teal-700 font-bold text-sm md:text-base">
          {index + 1}
        </span>
      </div>

      {/* 2. The Card Content */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
        
        {/* Header: Title Input + Delete Button */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-1">
            {/* Icon inside input */}
            <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
              <Map size={18} />
            </div>
            <input
              type="text"
              value={day.title}
              onChange={(e) => updateDay(day.id, "title", e.target.value)}
              placeholder="Title (e.g. Arrival & Sightseeing)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none font-semibold text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Modern Delete Button */}
          <button
            onClick={() => deleteDay(day.id)}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Day"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Description Textarea */}
        <div className="relative">
          <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
             <AlignLeft size={18} />
          </div>
          <textarea
            value={day.description}
            onChange={(e) => updateDay(day.id, "description", e.target.value)}
            placeholder="Describe the activities for this day..."
            rows={3}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-slate-600 text-sm leading-relaxed placeholder:text-slate-400 resize-y min-h-[100px] transition-all"
          />
        </div>
      </div>
    </div>
  );
}

export default DayItem;