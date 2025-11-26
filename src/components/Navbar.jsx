import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, Heart, Plus, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Map size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            TravelPlanner
          </span>
        </Link>

        {/* 2. Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/saved"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isActive("/saved") 
                ? "text-teal-700" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Heart size={18} className={isActive("/saved") ? "fill-teal-700" : ""} />
            Saved Trips
          </Link>

          <Link
            to="/"
            className="group flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-800 hover:shadow-md active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create New Trip
          </Link>
        </div>

        {/* 3. Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 4. Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden animate-fade-in shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              to="/saved"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Heart size={18} />
              Saved Trips
            </Link>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-sm active:scale-95"
            >
              <Plus size={18} />
              Create New Trip
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;