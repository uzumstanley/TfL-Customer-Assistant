import { useState } from "react";
import axios from "axios";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.post("http://0.0.0.0:8000/query", {
        question: query,
        top_k: 3,
      });
      setResults(response.data.top_results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">TfL RAG System</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Ask a TfL-related question..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-6 w-full max-w-md">
        {results.length > 0 && (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Results:
            </h2>
            {results.map((result, index) => (
              <p key={index} className="text-gray-600 border-b py-2">
                {result}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
