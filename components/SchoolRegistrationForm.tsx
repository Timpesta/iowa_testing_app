"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { registerSchool } from "@/lib/actions/register";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = {
  name?: string;
  contact_name?: string;
  contact_email?: string;
};

export function SchoolRegistrationForm() {
  const [state, formAction] = useFormState(registerSchool, null);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(values: {
    name: string;
    contact_name: string;
    contact_email: string;
  }): boolean {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "School name is required.";
    if (!values.contact_name.trim())
      next.contact_name = "Contact name is required.";
    if (!values.contact_email.trim()) {
      next.contact_email = "Contact email is required.";
    } else if (!EMAIL_REGEX.test(values.contact_email)) {
      next.contact_email = "Please enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string) ?? "";
    const contact_name = (formData.get("contact_name") as string) ?? "";
    const contact_email = (formData.get("contact_email") as string) ?? "";
    if (!validate({ name, contact_name, contact_email })) return;
    formAction(formData);
  }

  if (state?.success) {
    return (
      <div
        role="alert"
        className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-4 text-sm"
      >
        {state.message}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {state && !state.success && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm"
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy-800 mb-1">
          School name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="organization"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
          placeholder="e.g. Lincoln Elementary"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact_name" className="block text-sm font-medium text-navy-800 mb-1">
          Contact name
        </label>
        <input
          id="contact_name"
          name="contact_name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={!!errors.contact_name}
          aria-describedby={errors.contact_name ? "contact_name-error" : undefined}
          className={inputClass}
          placeholder="e.g. Jane Smith"
        />
        {errors.contact_name && (
          <p id="contact_name-error" className="mt-1 text-sm text-red-600">
            {errors.contact_name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact_email" className="block text-sm font-medium text-navy-800 mb-1">
          Contact email
        </label>
        <input
          id="contact_email"
          name="contact_email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={!!errors.contact_email}
          aria-describedby={errors.contact_email ? "contact_email-error" : undefined}
          className={inputClass}
          placeholder="e.g. jane@school.edu"
        />
        {errors.contact_email && (
          <p id="contact_email-error" className="mt-1 text-sm text-red-600">
            {errors.contact_email}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-navy-800 px-4 py-2.5 text-white font-semibold hover:bg-navy-900 transition-colors"
      >
        Submit registration
      </button>
    </form>
  );
}
