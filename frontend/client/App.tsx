import "./global.css";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./providers/AppProviders";
import { AppRouter } from "./router/AppRouter";
import { SEOAnalytics, trackPerformance } from "./components/seo/SEOAnalytics";

// Suppress third-party library defaultProps warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // Suppress Recharts defaultProps warnings
  if (
    typeof args[0] === "string" &&
    args[0].includes(
      "Support for defaultProps will be removed from function components",
    ) &&
    (args[0].includes("XAxis") ||
      args[0].includes("YAxis") ||
      args[0].includes("Tooltip") ||
      args[0].includes("CartesianGrid"))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

const App = () => {
  // Initialize performance tracking
  trackPerformance();

  return (
    <AppProviders>
      <SEOAnalytics />
      <AppRouter />
    </AppProviders>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
