
import axios from "axios";
import { useState } from "react";

export default function AiCommandPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const raw = localStorage.getItem("token");
      const token = raw ? JSON.parse(raw)?.state?.token : null;

      const response = await axios.post(
        "http://localhost:8000/api/v1/ai/command",
        { input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">🤖 AI Task Assistant</h1>

        <p className="text-gray-600 mb-4">
          Type a command like:
          <br />
          <span className="italic text-sm text-gray-500">
            “Create task add table of users and assign to John”
          </span>
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your instruction here..."
          className="w-full h-28 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Run AI Command"}
        </button>

        {response && (
          <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-800">
            {response}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-800">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
