"use client";

import { useState, type FormEvent } from "react";
import { type ClinicService } from "@/lib/api-client";
import type { Locale } from "@/i18n/config";

type Step = "service" | "schedule" | "details";

const stepOrder: Step[] = ["service", "schedule", "details"];

export function BookingWizard({
  locale,
  services
}: {
  locale: Locale;
  services: ClinicService[];
}) {
  const [currentStep, setCurrentStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<string>(
    services[0]?.slug ?? ""
  );

  const goToNext = () => {
    const nextIndex = stepOrder.indexOf(currentStep) + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const goToPrevious = () => {
    const prevIndex = stepOrder.indexOf(currentStep) - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentStep === "details") {
      // Placeholder success feedback; replaced by API integration in future phase.
      alert("Booking submitted! WhatsApp + email confirmation will follow.");
      return;
    }
    goToNext();
  };

  return (
    <div className="space-y-8">
      <Stepper currentStep={currentStep} />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {currentStep === "service" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Choose a treatment
            </h2>
            <p className="text-sm text-slate-500">
              Pick the service you want to book. You can change this later.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {services.map((service) => (
                <label
                  key={service.slug}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selectedService === service.slug
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.slug}
                    checked={selectedService === service.slug}
                    onChange={() => setSelectedService(service.slug)}
                    className="sr-only"
                  />
                  <h3 className="text-base font-semibold text-slate-900">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{service.summary}</p>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === "schedule" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              2. Select a preferred time
            </h2>
            <p className="text-sm text-slate-500">
              Availability will load here based on your chosen service and doctor.
            </p>
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Placeholder calendar. In the next iteration we will display doctor-specific
              availability synchronized from the Admin API.
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              3. Enter your details
            </h2>
            <p className="text-sm text-slate-500">
              Confirmation will be shared via email and WhatsApp once submitted.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  First name
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Amina"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Last name
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Khan"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Mobile (WhatsApp)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="+971 55 000 0000"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">
                Notes
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Let us know if you have specific concerns or preferences."
                rows={3}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={currentStep === "service"}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {currentStep === "details" ? "Submit booking" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: Step }) {
  return (
    <ol className="flex items-center justify-between gap-4 text-sm font-medium text-slate-500">
      {stepOrder.map((step, index) => {
        const isActive = currentStep === step;
        const isCompleted = stepOrder.indexOf(currentStep) > index;
        return (
          <li key={step} className="flex flex-1 items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : isCompleted
                  ? "border-blue-200 bg-blue-100 text-blue-600"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              {index + 1}
            </span>
            <span className={isActive ? "text-slate-900" : ""}>{labelFor(step)}</span>
            {index < stepOrder.length - 1 && (
              <span className="flex-1 border-t border-dashed border-slate-200" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function labelFor(step: Step) {
  switch (step) {
    case "service":
      return "Service";
    case "schedule":
      return "Schedule";
    case "details":
      return "Details";
    default:
      return step;
  }
}
