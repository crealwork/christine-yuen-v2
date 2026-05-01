"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export default function EstimatorForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-[var(--color-canvas)] p-8 md:p-12 border-l-2 border-[var(--color-accent-500)]">
        <p className="eyebrow mb-6">Thanks — request received</p>
        <p
          className="mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 96',
            fontSize: "40px",
            lineHeight: "1.1",
            letterSpacing: "-0.015em",
            color: "var(--color-ink)",
          }}
        >
          Christine will email you within 24 hours.
        </p>
        <p className="type-body-essay mb-4">
          She'll review your details against current Richmond and Vancouver comparables — including recent activity that affects your property — and reply with a refined range.
        </p>
        <p
          className="text-base italic"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-700)" }}
        >
          — Check your inbox shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <fieldset className="space-y-6">
        <legend className="eyebrow mb-4">About the property</legend>

        <Field label="Property type" required>
          <select name="propertyType" required defaultValue="" className="field-input">
            <option value="" disabled>Choose…</option>
            <option value="condo">Condo / Apartment</option>
            <option value="townhome">Townhome</option>
            <option value="detached">Detached / Single-family</option>
          </select>
        </Field>

        <Field label="Neighborhood" required>
          <select name="neighborhood" required defaultValue="" className="field-input">
            <option value="" disabled>Choose…</option>
            <option value="vancouver-west">Vancouver — West Side</option>
            <option value="vancouver-east">Vancouver — East Side</option>
            <option value="burnaby-brentwood">Burnaby — Brentwood</option>
            <option value="burnaby-metrotown">Burnaby — Metrotown</option>
            <option value="burnaby-other">Burnaby — other</option>
            <option value="richmond">Richmond</option>
            <option value="north-shore">North / West Vancouver</option>
            <option value="tri-cities">Tri-Cities (Coquitlam / PoCo / Port Moody)</option>
            <option value="new-westminster">New Westminster</option>
            <option value="surrey-white-rock">Surrey / White Rock</option>
          </select>
        </Field>

        <Field label="Address (optional)">
          <input
            name="address"
            type="text"
            placeholder="e.g. 123 - 4567 Brentwood Blvd, Burnaby"
            className="field-input"
          />
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
            <select name="condition" required defaultValue="" className="field-input">
              <option value="" disabled>Choose…</option>
              <option value="move-in-ready">Move-in ready</option>
              <option value="some-updates">Some updates needed</option>
              <option value="major-reno">Major renovation needed</option>
            </select>
          </Field>
        </div>

        <Field label="Why are you checking?">
          <select name="reason" defaultValue="curious" className="field-input">
            <option value="curious">Just curious</option>
            <option value="selling">Considering selling</option>
            <option value="buying-similar">Buying something similar</option>
            <option value="refinancing">Refinancing</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </fieldset>

      <fieldset className="space-y-6 pt-8 border-t border-[var(--color-line)]">
        <legend className="eyebrow mb-4">Where to send the estimate</legend>
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
          disabled={status === "submitting"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Request my estimate"}
        </button>
        {status === "error" && (
          <p className="mt-4 text-red-700">
            Something went wrong. Please call or text Christine at 604-808-9918.
          </p>
        )}
        <p className="mt-4 text-xs text-[var(--color-graphite)] max-w-md">
          Your details go to Christine directly. No newsletter, no third-party data sales.
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
