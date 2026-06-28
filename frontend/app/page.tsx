"use client";

import { useState } from "react";
import { triage } from "@/lib/api";

type Result = {
  symptoms: string;
  is_emergency: boolean;
  emergency_reason: string;
  urgency: string;
  health_info: string;
  specialist: string;
  disclaimer: string;
};

const urgencyColor: Record<string, string> = {
  LOW: "bg-green-100 text-green-700 border-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
  HIGH: "bg-orange-100 text-orange-700 border-orange-300",
};

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("Symptoms describe කරන්න!");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await triage(input);
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Backend running ද check කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-teal-700">
            🏥 AI Symptom Triage Assistant
          </h1>
          <p className="text-gray-500 mt-2">
            Describe your symptoms → get guidance on urgency & next steps
          </p>
        </div>

        {/* Top disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          ⚠️ This tool is for <strong>informational purposes only</strong> and is
          NOT a substitute for professional medical advice. In an emergency, call
          your local emergency number immediately.
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Describe your symptoms
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I've had a headache and mild fever for 2 days..."
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
          >
            {loading ? "Analyzing symptoms... ⏳" : "Check Symptoms 🩺"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* 🚨 EMERGENCY ALERT */}
            {result.is_emergency ? (
              <div className="bg-red-600 text-white rounded-2xl shadow-lg p-6 animate-pulse">
                <h2 className="text-2xl font-bold mb-2">
                  🚨 EMERGENCY WARNING
                </h2>
                <p className="mb-2">{result.emergency_reason}</p>
                <p className="font-semibold text-lg">
                  ☎️ Call your local emergency number IMMEDIATELY or go to the
                  nearest emergency room.
                </p>
              </div>
            ) : (
              <>
                {/* Urgency Badge */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    Urgency Level
                  </h2>
                  <span
                    className={`inline-block px-6 py-2 rounded-full border font-bold text-lg ${
                      urgencyColor[result.urgency] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {result.urgency}
                  </span>
                </div>

                {/* Extracted Symptoms */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    📝 Identified Symptoms
                  </h2>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {result.symptoms}
                  </pre>
                </div>

                {/* Health Info (RAG) */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    💡 Health Information
                  </h2>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {result.health_info}
                  </pre>
                </div>

                {/* Specialist */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    👨‍⚕️ Recommended Specialist
                  </h2>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {result.specialist}
                  </pre>
                </div>
              </>
            )}

            {/* Bottom disclaimer (always shown) */}
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
              {result.disclaimer}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}