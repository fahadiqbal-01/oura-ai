"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INDUSTRIES = [
  "Tech",
  "Fashion",
  "Food & Beverage",
  "Health",
  "Finance",
  "Creative Agency",
  "Education",
  "Real Estate",
];

const VIBES = [
  "Minimal",
  "Bold",
  "Playful",
  "Luxury",
  "Futuristic",
  "Earthy",
  "Corporate",
  "Rebellious",
];

export default function StepForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [vibes, setVibes] = useState([]);
  const [audience, setAudience] = useState("");

  const toggleVibe = (v) =>
    setVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );

  const canNext = [
    brandName.trim().length > 0,
    industry.length > 0,
    vibes.length > 0,
    audience.trim().length > 0,
  ][step];

  const steps = [
    <div key="0" className="space-y-6">
      <h2 className="text-3xl font-light tracking-tight">
        Describe your brand vision
      </h2>
      <textarea
        className="w-full bg-transparent border-b border-neutral-700 py-4 text-2xl 
                   outline-none focus:border-white transition-colors font-light h-32 resize-none"
        placeholder="e.g. A premium sustainable fragrance brand inspired by Nordic minimalism and raw coastal elements..."
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
      />
    </div>,

    <div key="1" className="space-y-6">
      <h2 className="text-3xl font-light tracking-tight">
        Select your industry
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {INDUSTRIES.map((i) => (
          <button
            key={i}
            onClick={() => setIndustry(i)}
            className={`px-4 py-4 rounded-xl border transition-all text-sm ${
              industry === i
                ? "border-white bg-white text-black font-medium"
                : "border-neutral-800 hover:border-neutral-600 text-neutral-400"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>,

    <div key="2" className="space-y-6">
      <h2 className="text-3xl font-light tracking-tight">Pick your vibes</h2>
      <div className="flex flex-wrap gap-3">
        {VIBES.map((v) => (
          <button
            key={v}
            onClick={() => toggleVibe(v)}
            className={`px-6 py-2 rounded-full border text-sm transition-all ${
              vibes.includes(v)
                ? "border-white bg-white text-black"
                : "border-neutral-800 hover:border-neutral-600 text-neutral-400"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>,

    <div key="3" className="space-y-6">
      <h2 className="text-3xl font-light tracking-tight">
        Who is your audience?
      </h2>
      <textarea
        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl
                   p-6 text-white outline-none focus:border-neutral-600 transition h-32"
        placeholder="e.g. Young professionals seeking minimalist aesthetics..."
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-12">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-white" : "bg-neutral-800"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center pt-8">
          <button
            onClick={() => setStep((s) => s - 1)}
            className={`text-neutral-500 hover:text-white transition ${step === 0 ? "invisible" : ""}`}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="px-10 py-4 rounded-full bg-white text-black font-medium 
                         disabled:opacity-20 transition-opacity"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => onSubmit({ brandName, industry, vibes, audience })}
              disabled={!canNext}
              className="px-10 py-4 rounded-full bg-white text-black font-medium 
                         disabled:opacity-20 transition-opacity"
            >
              Generate Identity
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
