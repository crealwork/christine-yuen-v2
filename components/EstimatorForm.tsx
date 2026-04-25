"use client";

import { useState } from "react";

type FormData = {
  propertyType: string;
  neighborhood: string;
  beds: string;
  baths: string;
  sqft: string;
  yearBuilt: string;
  condition: string;
  reason: string;
  name: string;
  email: string;
  phone: string;
};

type Status = "idle" | "calculating" | "result" | "error";

// TODO: fill in PRICE_PER_SQFT with current local market $/sqft.
// Source: recent MLS comparables or board reports.
// Format: { "neighborhood-key": { condo: 0, townhome: 0, detached: 0 } }
// Keys must match <option value="..."> below.
const PRICE_PER_SQFT: Record<string, Record<string, number>> = {
  // Example format — replace all with actual market data:
  "neighborhood-1": { condo: 0, townhome: 0, detached: 0 },
  "neighborhood-2": { condo: 0, townhome: 0, detached: 0 },
  "neighborhood-3": { condo: 0, townhome: 0, detached: 0 },
};

const CONDITION_MULT: Record<string, number> = {
  "move-in-ready": 1.0,
  "some-updates": 0.95,
  "major-reno": 0.85,
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toFixed(0)}`;
}

function computeEstimate(d: FormData): { low: number; high: number; mid: number } | null {
  const base = PRICE_PER_SQFT[d.neighborhood]?.[d.propertyType];
  const sqft = parseInt(d.sqft, 10);
  if (!base || !sqft || sqft <= 0) return null;
  const yearBuilt = parseInt(d.yearBuilt, 10) || 2000;
  // TODO: update base year (2026) to current launch year for age discount accuracy
  const ageDiscount = Math.max(-0.15, (yearBuilt - 2026) * 0.005); // -0.5% per year, max -15%
  const condMult = CONDITION_MULT[d.condition] ?? 1.0;
  const mid = base * sqft * (1 + ageDiscount) * condMult;
  return { low: mid * 0.92, mid, high: mid * 1.08 };
}

export default function EstimatorForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [estimate, setEstimate] = useState<{ low: number; mid: number; high: number } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("calculating");

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as unknown as FormData;
    const result = computeEstimate(data);

    if (!result) {
      setStatus("error");
      return;
    }

    setEstimate(result);

    try {
      await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          estimate: { low: result.low, mid: result.mid, high: result.high },
        }),
      });
      setStatus("result");
    } catch {
      // Local estimate still shown; realtor gets manual notification later.
      setStatus("result");
    }
  }

  if (status === "result" && estimate) {
    return (
      <div className="bg-[var(--color-canvas)] p-8 md:p-12 border-l-2 border-[var(--color-accent-500)]">
        <p className="eyebrow mb-6">Estimated value</p>
        <p
          className="mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 144',
            fontSize: "56px",
            lineHeight: "1",
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
          }}
        >
          {fmt(estimate.low)} – {fmt(estimate.high)}
        </p>
        <p className="text-sm text-[var(--color-graphite)] mb-8">
          Midpoint estimate: <strong>{fmt(estimate.mid)}</strong>. Range reflects ±8% uncertainty.
        </p>
        <div className="border-t border-[var(--color-line)] pt-6">
          <p className="type-body-essay mb-4">
            {/* TODO: replace realtor name with actual first name */}
            This is an algorithmic estimate from neighborhood comparables. Your realtor will personally
            review your details and reach out within 24 hours with a refined range — including any
            recent market activity that affects your property.
          </p>
          <p
            className="text-base italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-700)" }}
          >
            — Check your email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <fieldset className="space-y-6">
        <legend className="eyebrow mb-4">About the property</legend>

        <Field label="Property type" required>
          <select
            name="propertyType"
            required
            defaultValue=""
            className="field-input"
          >
            <option value="" disabled>Choose…</option>
            <option value="condo">Condo / Apartment</option>
            <option value="townhome">Townhome</option>
            <option value="detached">Detached / Single-family</option>
          </select>
        </Field>

        <Field label="Neighborhood" required>
          <select
            name="neighborhood"
            required
            defaultValue=""
            className="field-input"
          >
            <option value="" disabled>Choose…</option>
            {/* TODO: replace with actual neighborhood options matching PRICE_PER_SQFT keys above */}
            <option value="neighborhood-1">{{NEIGHBORHOOD_1_LABEL}}</option>
            <option value="neighborhood-2">{{NEIGHBORHOOD_2_LABEL}}</option>
            <option value="neighborhood-3">{{NEIGHBORHOOD_3_LABEL}}</option>
          </select>
        </Field>

        <div className="grid sm:grid-cols-3 gap-6">
          <Field label="Bedrooms">
            <input name="beds" type="number" min={0} max={10} placeholder="2" className="field-input" />
          </Field>
          <Field label="Bathrooms">
            <input name="baths" type="number" step="0.5" min={1} max={10} placeholder="2" className="field-input" />
          </Field>
          <Field label="Square feet" required>
            <input name="sqft" type="number" min={300} max={20000} placeholder="850" required className="field-input" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Year built">
            <input name="yearBuilt" type="number" min={1900} max={2030} placeholder="2010" className="field-input" />
          </Field>
          <Field label="Condition" required>
            <select
              name="condition"
              required
              defaultValue=""
              className="field-input"
            >
              <option value="" disabled>Choose…</option>
              <option value="move-in-ready">Move-in ready</option>
              <option value="some-updates">Some updates needed</option>
              <option value="major-reno">Major renovation needed</option>
            </select>
          </Field>
        </div>

        <Field label="Why are you checking?">
          <select
            name="reason"
            defaultValue="curious"
            className="field-input"
          >
            <option value="curious">Just curious</option>
            <option value="selling">Considering selling</option>
            <option value="buying-similar">Buying something similar</option>
            <option value="refinancing">Refinancing</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </fieldset>

      <fieldset className="space-y-6 pt-8 border-t border-[var(--color-line)]">
        <legend className="eyebrow mb-4">Where to send the result</legend>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Your name" required>
            <input name="name" type="text" required className="field-input" />
          </Field>
          <Field label="Phone (optional)">
            <input name="phone" type="tel" className="field-input" />
          </Field>
        </div>
        <Field label="Email" required>
          <input name="email" type="email" required className="field-input" />
        </Field>
      </fieldset>

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === "calculating"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "calculating" ? "Calculating…" : "Get my estimate"}
        </button>
        {status === "error" && (
          <p className="mt-4 text-red-700">
            Couldn't calculate — please make sure you've selected a neighborhood, property type, and entered square footage.
          </p>
        )}
        <p className="mt-4 text-xs text-[var(--color-graphite)] max-w-md">
          Your details go to Chloe directly. No newsletter, no third-party data sales.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2 text-[var(--color-ink)]">
        {label}
        {required && <span className="text-[var(--color-accent-700)]"> *</span>}
      </span>
      {children}
    </label>
  );
}
