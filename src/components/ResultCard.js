"use client";
import { motion } from "framer-motion";
import { useRef } from "react";

// Animation variants for a "premium" reveal
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function ResultCard({ brand, brandName, onReset }) {
  const cardRef = useRef(null);

  // 1. DATA GUARD: Prevents "undefined" errors if state is mid-update
  if (!brand || !brand.fontPairing || !brand.colorPalette) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 animate-pulse">Finalizing identity...</p>
      </div>
    );
  }

  const handleExport = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const element = cardRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: "#0a0a0a",
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${brandName}-identity.pdf`);
  };

  // 2. SAFE FONT LOADING: Uses Optional Chaining and fallback values
  const headingFont = brand.fontPairing?.heading || "Inter";
  const bodyFont = brand.fontPairing?.body || "Inter";

  const fontLink = `https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, "+")}&family=${bodyFont.replace(/ /g, "+")}&display=swap`;

  return (
    <div className="min-h-screen py-20 px-6">
      <link rel="stylesheet" href={fontLink} />

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-2">
              Result
            </p>
            <h1 className="text-4xl font-light tracking-tighter">
              {brandName}
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onReset}
              className="text-sm text-neutral-400 hover:text-white transition"
            >
              Start Over
            </button>
            <button
              onClick={handleExport}
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition"
            >
              Download PDF
            </button>
          </div>
        </div>

        <motion.div
          ref={cardRef}
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-12 md:p-16 space-y-20"
        >
          {/* Logo Section */}
          <motion.div
            variants={item}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div
              style={{ backgroundColor: brand.colorPalette[0] || "#333" }}
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
            >
              {brand.logoLetter || brandName.charAt(0)}
            </div>
            <p
              className="text-2xl italic font-light text-neutral-300"
              style={{ fontFamily: headingFont }}
            >
              "{brand.tagline || "A new standard in design."}"
            </p>
          </motion.div>

          {/* Color Palette */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] text-neutral-500 text-center">
              Visual DNA
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {brand.colorPalette.map((color, i) => (
                <div key={i} className="space-y-3">
                  <div
                    style={{ backgroundColor: color }}
                    className="aspect-square rounded-2xl shadow-inner border border-white/5"
                  />
                  <p className="text-[10px] text-center font-mono text-neutral-500">
                    {color?.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Typography & Personality */}
          <motion.div
            variants={item}
            className="grid md:grid-cols-2 gap-16 border-t border-neutral-800 pt-16"
          >
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500">
                Typography
              </h3>
              <p
                style={{ fontFamily: headingFont }}
                className="text-3xl leading-tight"
              >
                {headingFont}
              </p>
              <p
                style={{ fontFamily: bodyFont }}
                className="text-neutral-400 text-sm"
              >
                {bodyFont} — Used for secondary communication and body copy.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500">
                Personality
              </h3>
              <p className="text-neutral-300 leading-relaxed font-light">
                {brand.brandPersonality ||
                  "An identity built for modern impact."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
