"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Cycle } from "@/lib/cycles";
import { formatCycleLabel } from "@/lib/cycles";
import { startNewCycle } from "@/lib/actions/cycles";

type Props = {
  activeCycle: Cycle | null;
  history: Cycle[];
  currentYear: number;
};

type Step = "configure" | "confirm";

export function CyclesPageClient({ activeCycle, history, currentYear }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<Step>("configure");
  const [type, setType] = useState<"fall" | "spring">("fall");
  const [year, setYear] = useState(currentYear);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isFall = type === "fall";

  const warningMessage = isFall
    ? "Starting a Fall cycle will increment every active student's grade by 1, and mark all Grade 12 students as inactive."
    : "Starting a Spring cycle carries students over as-is — no grade changes.";

  function openModal() {
    setShowModal(true);
    setStep("configure");
    setError(null);
    setYear(currentYear);
    setType("fall");
  }

  function closeModal() {
    setShowModal(false);
    setStep("configure");
    setError(null);
  }

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await startNewCycle(type, year);
      if (result.success) {
        closeModal();
        router.refresh();
      } else {
        setError(result.message ?? "Something went wrong. Please try again.");
        setStep("configure");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setStep("configure");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Current cycle card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-2">Current cycle</h2>
        {activeCycle ? (
          <p className="text-2xl font-semibold text-slate-900">{formatCycleLabel(activeCycle)}</p>
        ) : (
          <p className="text-slate-500 text-sm">No active cycle. Start one below.</p>
        )}
        <button
          type="button"
          onClick={openModal}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800"
        >
          Start new cycle
        </button>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-medium text-slate-900 mb-3">Past cycles</h2>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No past cycles yet.</p>
        ) : (
          <ul className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {history.map((c) => (
              <li key={c.id} className="px-4 py-3 text-slate-700">
                {formatCycleLabel(c)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-cycle-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {step === "configure" ? (
              <>
                <h2 id="new-cycle-title" className="text-xl font-semibold text-slate-900 mb-4">
                  Start new cycle
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as "fall" | "spring")}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    >
                      <option value="fall">Fall</option>
                      <option value="spring">Spring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value, 10) || currentYear)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    />
                  </div>

                  <div
                    className={`rounded-lg border px-4 py-3 text-sm ${
                      isFall
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-blue-50 border-blue-200 text-blue-800"
                    }`}
                  >
                    <p className="font-medium mb-1">
                      {isFall ? "Grade changes will apply" : "No grade changes"}
                    </p>
                    <p>{warningMessage}</p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm"
                    >
                      {error}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep("confirm");
                    }}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800"
                  >
                    Review &amp; confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="new-cycle-title" className="text-xl font-semibold text-slate-900 mb-1">
                  Confirm new cycle
                </h2>
                <p className="text-slate-500 text-sm mb-5">
                  Please review before proceeding — this cannot be undone.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm space-y-2 mb-5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cycle</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {type} {year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current cycle closed</span>
                    <span className="font-medium text-slate-900">
                      {activeCycle ? formatCycleLabel(activeCycle) : "none"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grade changes</span>
                    <span className="font-medium text-slate-900">
                      {isFall ? "Yes — grades +1, grade 12 inactive" : "None"}
                    </span>
                  </div>
                </div>

                {isFall && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm mb-5">
                    <strong>Warning:</strong> All active students will have their grade
                    incremented. Grade 12 students will be marked inactive. This affects
                    every school.
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-4"
                  >
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setStep("configure")}
                    disabled={submitting}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={submitting}
                    className={`rounded-lg px-4 py-2 text-white font-medium disabled:opacity-50 disabled:pointer-events-none ${
                      isFall
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    {submitting ? "Starting…" : `Start ${type} ${year}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
