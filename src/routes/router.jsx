import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SavedItineraries from "../pages/SavedItineraries";
import CreateItinerary from "../pages/CreateItinerary";
import EditItinerary from "../pages/EditItinerary";
import App from "../App";


const router = createBrowserRouter([
  {
    element: <App />, // <-- LAYOUT WRAPPER IS MANDATORY FOR NAVBAR
    children: [
      { path: "/", 
        element: <CreateItinerary /> 
      },
      { path: "/saved", 
        element: <SavedItineraries /> 
      },
      { path: "/edit/:id",
        element: <EditItinerary /> }
    ],
  },
]);

export default router;
