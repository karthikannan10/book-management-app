import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BookDashboard from "./Pages/Dashboard/BookDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BookDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
