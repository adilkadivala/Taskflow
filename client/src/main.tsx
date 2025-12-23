import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="system" storageKey="task-management-theme">
      <App />
      <Toaster theme="system" richColors closeButton />
    </ThemeProvider>
  </BrowserRouter>
);
