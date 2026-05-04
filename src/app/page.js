"use client";
import { useState } from "react";
import StepForm from "@/components/StepForm";
import ResultCard from "@/components/ResultCard";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleGenerate = async (data) => {
    setLoading(true);
    setFormData(data);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans">
      {!result && !loading && <StepForm onSubmit={handleGenerate} />}

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="animate-pulse text-neutral-400 text-lg">
            Creating your brand...
          </p>
        </div>
      )}

      {result && formData && (
        <ResultCard
          brand={result}
          brandName={formData.brandName}
          onReset={() => setResult(null)}
        />
      )}
    </main>
  );
}
