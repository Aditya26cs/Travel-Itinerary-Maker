import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast"; // 1. Import it

function App() {
  return (
    // Changed bg-gray-100 to bg-slate-50 to match your modern theme
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* 2. RENDER TOASTER HERE */}
      {/* I added some styling so the toasts match your Teal theme */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e293b', // Dark Slate background
            color: '#fff',         // White text
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#14b8a6', // Teal-500 icon
              secondary: '#fff',
            },
          },
        }}
      />

      <Navbar />
      
      {/* 3. LAYOUT FIX: Removed 'max-w-4xl' so your Dashboard Grid has space to breathe */}
      <main className="flex-1 w-full"> 
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;