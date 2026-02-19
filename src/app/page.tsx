import { EnhancedPredictionMarketDashboard } from "@/components/enhanced-prediction-market-dashboard";
// Imports the main dashboard UI component for the prediction market.
// This component contains the actual page content and logic.

export default function Home() {
  // Defines the homepage of the application.
  // In Next.js, this file automatically becomes the "/" (root) route.

  return (
    <EnhancedPredictionMarketDashboard />
    // Renders the prediction market dashboard on the homepage.
    // All user interaction, data display, and logic live inside this component.
  );
}
