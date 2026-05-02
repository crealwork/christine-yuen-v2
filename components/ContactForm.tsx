"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contactPage.form");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // Optimistic UI: show success immediately. Webhook fires in background.
    setStatus("success");
    form.reset();
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((err) => console.error("contact submit failed:", err));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field name="name" label={t("name")} required />
        <Field name="phone" label={t("phone")} type="tel" required />
      </div>
      <Field name="email" label={t("email")} type="email" />
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium mb-2 text-[var(--color-ink)]"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={t("messagePlaceholder")}
          className="field-input resize-y"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        {status === "success" && (
          <p className="mt-4 text-[var(--color-accent-700)] font-medium">
            {t("success")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-700">{t("error")}</p>
        )}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-2 text-[var(--color-ink)]"
      >
        {label}
        {required && <span className="text-[var(--color-accent-700)]"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="field-input"
      />
    </div>
  );
}
