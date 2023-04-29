import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
  createRoutesFromElements,
} from "react-router-dom";
import Bidding from "./routes/Bidding";
import Home from "./routes/Home";
import PaperDetails from "./routes/PaperDetails";
import Navbar from "./components/Navbar";
import RegisterPaper from "./routes/RegisterPaper";
import ApprovePaper from "./routes/ApprovePaper";
import "./App.css";
import App from "./App"

//const client = require('pg');

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={<AppLayout />}>
//       <Route path="/" element={<Home />} />
//       <Route path="/products" element={<Products />} />
//       <Route path="/reports" element={<Reports />} />
//     </Route>
//   )
// );

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "bidding",
        element: <Bidding/>,
      },
      {
        path: "paperdetails",
        element: <PaperDetails/>,
      },
      {
        path: "registerpaper",
        element: <RegisterPaper/>
      },
      {
        path: "approvepaper",
        element: <ApprovePaper/>
      },
    ],
  },
]);

{/* <Route path="/passport" element={<PassportPhoto uuid={this.state.uuid} />} /> */}

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
