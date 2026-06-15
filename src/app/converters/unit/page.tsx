"use client";

import { useState } from "react";
import { Scale, Ruler, Database, RotateCcw } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { UNIT_CONVERTER_FAQS } from "@/data/faqs";


export default function UnitConverterPage() {
  // Data Size States
  const [dataInput, setDataInput] = useState({ val: "", unit: "GB" });
  
  // Length States
  const [lengthInput, setLengthInput] = useState({ val: "", unit: "m" });
  
  // Weight States
  const [weightInput, setWeightInput] = useState({ val: "", unit: "kg" });

  const handleReset = () => {
    setDataInput({ val: "", unit: "GB" });
    setLengthInput({ val: "", unit: "m" });
    setWeightInput({ val: "", unit: "kg" });
  };

  // 1. Data Size Conversions (Base unit: Bytes B)
  const dataRatios: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const getDataValue = (targetUnit: string) => {
    const num = parseFloat(dataInput.val);
    if (isNaN(num)) return "";
    
    // If user is currently typing in this target field, show what they are typing directly
    if (dataInput.unit === targetUnit) return dataInput.val;

    const baseBytes = num * dataRatios[dataInput.unit];
    const converted = baseBytes / dataRatios[targetUnit];
    
    // Limit decimal precision and trim trailing zeros
    return parseFloat(converted.toFixed(10)).toString();
  };

  // 2. Length Conversions (Base unit: Meters m)
  const lengthRatios: Record<string, number> = {
    m: 1,
    km: 1000,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  };

  const getLengthValue = (targetUnit: string) => {
    const num = parseFloat(lengthInput.val);
    if (isNaN(num)) return "";
    
    if (lengthInput.unit === targetUnit) return lengthInput.val;

    const baseMeters = num * lengthRatios[lengthInput.unit];
    const converted = baseMeters / lengthRatios[targetUnit];
    
    return parseFloat(converted.toFixed(10)).toString();
  };

  // 3. Weight Conversions (Base unit: Kilograms kg)
  const weightRatios: Record<string, number> = {
    kg: 1,
    g: 0.001,
    lb: 0.45359237,
    oz: 0.028349523,
  };

  const getWeightValue = (targetUnit: string) => {
    const num = parseFloat(weightInput.val);
    if (isNaN(num)) return "";
    
    if (weightInput.unit === targetUnit) return weightInput.val;

    const baseKg = num * weightRatios[weightInput.unit];
    const converted = baseKg / weightRatios[targetUnit];
    
    return parseFloat(converted.toFixed(10)).toString();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Unit &amp; Dimension Converter
          </h1>
          <div className="flex items-center gap-2">
            <ShareButton 
              title="Unit Converter & Measurement Conversion | ApexToolHub" 
              text="Free online unit converter for data size, lengths, and weights. 100% Client-side." 
            />
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
              data-testid="reset-all-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All
            </button>
          </div>
        </div>
        <p className="text-sm text-muted">
          Convert data size metrics, length scales, and weight configurations. This unit converter online tool processes measurement transformations instantly as you type.
        </p>
      </div>


      {/* Converters Layout Stack */}
      <div className="space-y-6">
        {/* Data Converter Card */}
        <div className="border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
            <Database className="h-4 w-4 text-zinc-500" />
            Data Storage Converter
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Bytes (B)", unit: "B" },
              { label: "Kilobytes (KB)", unit: "KB" },
              { label: "Megabytes (MB)", unit: "MB" },
              { label: "Gigabytes (GB)", unit: "GB" },
              { label: "Terabytes (TB)", unit: "TB" },
            ].map((u) => (
              <div key={u.unit} className="space-y-1">
                <label className="block text-[11px] text-muted font-sans font-bold">{u.label}</label>
                <input
                  type="number"
                  value={getDataValue(u.unit)}
                  onChange={(e) => setDataInput({ val: e.target.value, unit: u.unit })}
                  placeholder="0"
                  className="w-full rounded border border-border bg-background py-1.5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[36px] font-mono tabular-nums"
                  translate="no"
                  data-testid={`data-input-${u.unit}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Length Converter Card */}
        <div className="border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
            <Ruler className="h-4 w-4 text-zinc-500" />
            Length &amp; Distance Converter
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { label: "Meters (m)", unit: "m" },
              { label: "Kilometers (km)", unit: "km" },
              { label: "Miles (mi)", unit: "mi" },
              { label: "Yards (yd)", unit: "yd" },
              { label: "Feet (ft)", unit: "ft" },
              { label: "Inches (in)", unit: "in" },
            ].map((u) => (
              <div key={u.unit} className="space-y-1">
                <label className="block text-[11px] text-muted font-sans font-bold">{u.label}</label>
                <input
                  type="number"
                  value={getLengthValue(u.unit)}
                  onChange={(e) => setLengthInput({ val: e.target.value, unit: u.unit })}
                  placeholder="0"
                  className="w-full rounded border border-border bg-background py-1.5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[36px] font-mono tabular-nums"
                  translate="no"
                  data-testid={`length-input-${u.unit}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Weight Converter Card */}
        <div className="border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
            <Scale className="h-4 w-4 text-zinc-500" />
            Weight &amp; Mass Converter
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Kilograms (kg)", unit: "kg" },
              { label: "Grams (g)", unit: "g" },
              { label: "Pounds (lb)", unit: "lb" },
              { label: "Ounces (oz)", unit: "oz" },
            ].map((u) => (
              <div key={u.unit} className="space-y-1">
                <label className="block text-[11px] text-muted font-sans font-bold">{u.label}</label>
                <input
                  type="number"
                  value={getWeightValue(u.unit)}
                  onChange={(e) => setWeightInput({ val: e.target.value, unit: u.unit })}
                  placeholder="0"
                  className="w-full rounded border border-border bg-background py-1.5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[36px] font-mono tabular-nums"
                  translate="no"
                  data-testid={`weight-input-${u.unit}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={UNIT_CONVERTER_FAQS} idPrefix="unit-faq" />
      </div>
    </div>
  );
}
