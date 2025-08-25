import React from "react";
import { Code, Copy, Download, FileText, Lightbulb, Play } from "lucide-react";

const QueryResultDisplay = ({
  userQuery,
  sqlQuery,
  explanation,
  activeTab,
  isGenerating,
  isExplaining,
}) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadQuery = (query) => {
    const element = document.createElement("a");
    const file = new Blob([query], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "query.sql";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadExplanation = (explanation) => {
    const element = document.createElement("a");
    const file = new Blob([explanation], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "query_explanation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full lg:w-1/2">
      {activeTab === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 h-[500px] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                Generated SQL Query
              </h2>
            </div>
            {sqlQuery && !isGenerating && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(sqlQuery)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => downloadQuery(sqlQuery)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                  title="Download as SQL file"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 shadow-inner h-[400px] sm:h-[500px] flex flex-col">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-400 border-t-transparent rounded-full mb-4"></div>
                <p className="text-green-400 text-base sm:text-lg font-semibold">
                  Generating your SQL query...
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This may take a few moments
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <pre className="text-green-400 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {sqlQuery ||
                    "🚀 Ready to generate your SQL query!\n\nFill out the form on the left and click 'Generate Query' to see your custom SQL statement appear here.\n\n✨ Features:\n• Copy to clipboard\n• Download as .sql file\n• Syntax highlighted display"}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 h-[500px] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg ">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                Query Analysis & Explanation
              </h2>
            </div>
            {explanation && !isExplaining && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(explanation)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                  title="Copy explanation"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => downloadExplanation(explanation)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                  title="Download explanation"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 sm:p-6 border-l-4 border-orange-400 shadow-inner flex-1 flex flex-col overflow-y-auto">
            {isExplaining ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-orange-400 border-t-transparent rounded-full mb-4"></div>
                <p className="text-orange-600 text-base sm:text-lg font-semibold">
                  Analyzing your SQL query...
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Breaking down the query structure and logic
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
                <div className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">
                  {explanation || (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 min-h-[300px]">
                      <div className="mb-6">
                        <Code className="w-16 h-16 sm:w-20 sm:h-20 text-orange-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-700">
                          Ready to Analyze Your Query!
                        </h3>
                        <p className="text-gray-600 mb-4 max-w-md text-sm sm:text-base px-4">
                          Write or paste your SQL query on the left (and include
                          schema if possible) to get an explanation.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryResultDisplay;
