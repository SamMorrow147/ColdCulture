"use client";

// Dynamic product route — /drops/knux-necklace, /drops/knux-tee-tan, etc.
// Renders the same carousel page; the component reads the slug from window.location.
import DropsPage from "../page";

export default function DropsSlugPage() {
  return <DropsPage />;
}
