import { User, Users, Building, Bed, Bus, CreditCard, Wallet } from "lucide-react";
import toast from "react-hot-toast";

function CustomerForm({ data, setData }) {
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // 1. Prevent Inappropriate Data (Negative Numbers)
    if (type === 'number' && value && parseFloat(value) < 0) {
      toast.error("Value cannot be negative", { id: `${name}-negative` });
      return; // Stop the update
    }

    setData({ ...data, [name]: value });
  };

  // 2. Check for Missing Fields on Blur (when user leaves the field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // List of optional fields that won't trigger errors
    const optionalFields = ["hotel_name", "cost_before"];
    
    if (optionalFields.includes(name)) return;

    if (!value || value.toString().trim() === "") {
      // Format name for display (e.g., "customer_name" -> "Customer Name")
      const fieldLabel = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Use a unique ID to prevent duplicate toasts stacking up
      toast.error(`${fieldLabel} is required`, { id: `${name}-required` });
    }
  };

  // Helper for input classes to keep code clean
  const inputClasses = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* 1. Name */}
      <div>
        <label className={labelClasses}>
          <User size={16} className="text-slate-400" /> Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          name="customer_name"
          value={data.customer_name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Rahul Sharma"
          className={inputClasses}
        />
      </div>

      {/* 2. Persons */}
      <div>
        <label className={labelClasses}>
          <Users size={16} className="text-slate-400" /> Number of Persons <span className="text-red-500">*</span>
        </label>
        <input
          name="persons"
          type="number"
          min="1"
          value={data.persons}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. 4"
          className={inputClasses}
        />
      </div>

      {/* 3. Hotel Category */}
      <div>
        <label className={labelClasses}>
          <Building size={16} className="text-slate-400" /> Hotel Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="hotel_category"
            value={data.hotel_category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClasses} appearance-none bg-white`}
          >
            <option value="">Select Category...</option>
            <option value="Budget">Budget</option>
            <option value="Standard">Standard</option>
            <option value="3 Star">3 Star</option>
            <option value="4 Star">4 Star</option>
            <option value="5 Star">5 Star</option>
            <option value="Luxury Villa">Luxury Villa</option>
            <option value="Homestay">Homestay</option>
          </select>
          {/* Custom arrow for select */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Hotel Name */}
      <div>
        <label className={labelClasses}>
          <Building size={16} className="text-slate-400" /> Hotel Name (Optional)
        </label>
        <input
          name="hotel_name"
          value={data.hotel_name}
          onChange={handleChange}
          placeholder="e.g. Hotel Radisson"
          className={inputClasses}
        />
      </div>

      {/* 5. Rooms */}
      <div>
        <label className={labelClasses}>
          <Bed size={16} className="text-slate-400" /> Number of Rooms <span className="text-red-500">*</span>
        </label>
        <input
          name="rooms"
          type="number"
          min="1"
          value={data.rooms}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. 2"
          className={inputClasses}
        />
      </div>

      {/* 6. Vehicle */}
      <div>
        <label className={labelClasses}>
          <Bus size={16} className="text-slate-400" /> Vehicle Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="vehicle"
            value={data.vehicle}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClasses} appearance-none bg-white`}
          >
            <option value="">Select Vehicle...</option>
            <option value="Sedan (Dzire)">Sedan (Dzire)</option>
            <option value="SUV (Innova)">SUV (Innova)</option>
            <option value="Tempo Traveller">Tempo Traveller</option>
            <option value="Bus (AC)">Bus (AC)</option>
            <option value="Bus (Non-AC)">Bus (Non-AC)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 7. Cost Before */}
      <div>
        <label className={labelClasses}>
          <CreditCard size={16} className="text-slate-400" /> Cost (Before Discount)
        </label>
        <input
          name="cost_before"
          type="number"
          value={data.cost_before}
          onChange={handleChange}
          placeholder="₹0.00"
          className={inputClasses}
        />
      </div>

      {/* 8. Final Cost */}
      <div>
        <label className={`${labelClasses} text-teal-700`}>
          <Wallet size={16} className="text-teal-600" /> Final Cost <span className="text-red-500">*</span>
        </label>
        <input
          name="final_cost"
          type="number"
          value={data.final_cost}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="₹0.00"
          className={`${inputClasses} border-teal-200 bg-teal-50 text-teal-900 placeholder:text-teal-300 focus:border-teal-600 focus:ring-teal-600/20 font-bold`}
        />
      </div>
    </div>
  );
}

export default CustomerForm;