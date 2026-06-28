"use client";

import { useState } from "react";
import { research } from "@/lib/api";

type Result = {
  topic: string;
  questions: string[];
  report: string;
  score: number;
  revisions: number;
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Research topic එකක් දාන්න!");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await research(topic);
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Backend running ද check කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700">
            🔬 Autonomous Research Assistant
          </h1>
          <p className="text-gray-500 mt-2">
            Give a topic → AI agents search, write & self-improve the report
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Research Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Impact of AI on modern education"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading
              ? "Researching... ⏳ (agents searching & writing, 1-2 min)"
              : "Start Research 🚀"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* Stats */}
            <div className="flex gap-4">
              <div className="flex-1 bg-white rounded-2xl shadow p-4 text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {result.score}/10
                </p>
                <p className="text-sm text-gray-500">Quality Score</p>
              </div>
              <div className="flex-1 bg-white rounded-2xl shadow p-4 text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {result.revisions}
                </p>
                <p className="text-sm text-gray-500">Revisions (loops)</p>
              </div>
            </div>

            {/* Research Questions */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                🎯 Research Questions
              </h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {result.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Report */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800">
                  📄 Research Report
                </h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.report);
                    alert("Copied!");
                  }}
                  className="bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Copy
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {result.report}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}