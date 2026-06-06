import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            border: "1px solid #ECECEA",
            color: "#0F0F12",
            borderRadius: "999px",
            padding: "12px 18px",
            boxShadow: "0 12px 24px -8px rgba(15, 15, 18, 0.12)",
          },
        }}
      />
    </div>
  );
}

export default App;
