import React, { useEffect, useState } from "react";
import {  Typography } from "@mui/material";
import api from "../services/api";
import { Code, Lightbulb, Zap } from "lucide-react";
import QueryResultDisplay from "../pages/QueryResultDisplay";

const QueryForm = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return {
        ...parsed,
        firstName: parsed.firstName || parsed.email.split("@")[0],
        lastName: parsed.lastName || "",
      };
    }
    return null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        ...parsed,
        firstName: parsed.firstName || parsed.email.split("@")[0],
        lastName: parsed.lastName || "",
      });
    }
  }, []);

  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState("");
  const [queryInstructions, setQueryInstructions] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");

  const [userQuery, setUserQuery] = useState("");
  const [explanation, setExplanation] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const data = { dbType: "MySQL", tableName, fields, queryInstructions };
      const response = await api.generateQuery(data);
      setSqlQuery(response.sql || "");
    } catch (error) {
      console.log("Error generating query:", error);
    }
    setIsGenerating(false);
  };

  const handleExplainQuery = async () => {
    if (!userQuery.trim()) return;
    setIsExplaining(true);
    try {
      const response = await api.explainQuery(userQuery);
      setExplanation(response.explanation || "");
    } catch (error) {
      console.log("Error generating query:", error);
    }
    setIsExplaining(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 ">
      <div className="max-w-7xl mx-auto mt-2">
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            textAlign: "center",
          }}
        >
          Good to see you here, {user?.firstName || "Guest"}!
        </Typography>

        <div className="flex justify-center mb-8 mt-3">
          <div className="bg-white  rounded-xl shadow-lg p-1 flex flex-col sm:flex-row w-full sm:w-auto max-w-md sm:max-w-none">
            <button
              onClick={() => setActiveTab(0)}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 0
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Code className="w-5 h-5" />
              Generate Query
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 mt-1 sm:mt-0 ${
                activeTab === 1
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              Analyze Written Query
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2">
            {activeTab === 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-4 border h-[500px] border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Enter Query Details
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Table Name
                    </label>
                    <input
                      type="text"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      placeholder="e.g., EmployeeDepartment_SalaryPayments"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fields
                    </label>
                    <input
                      type="text"
                      value={fields}
                      onChange={(e) => setFields(e.target.value)}
                      placeholder="e.g., id, name, department_id, amount, date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Query Instructions
                    </label>
                    <textarea
                      value={queryInstructions}
                      onChange={(e) => setQueryInstructions(e.target.value)}
                      placeholder="e.g., List departments with >10 employees in last 3 months"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isGenerating}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      isGenerating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Generate Query
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-4 border h-[500px] border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Lightbulb className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Your SQL Query
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <textarea
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Write or paste your SQL query here to get an explanation..."
                      rows={12}
                      className="w-full h-80 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200 font-mono text-sm resize-none"
                    />
                  </div>

                  <button
                    onClick={handleExplainQuery}
                    disabled={!userQuery.trim() || isExplaining}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      !userQuery.trim() || isExplaining
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isExplaining ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-5 h-5" />
                        Analyze Query
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <QueryResultDisplay
            sqlQuery={sqlQuery}
            explanation={explanation}
            activeTab={activeTab}
            isGenerating={isGenerating}
            isExplaining={isExplaining}
          />
        </div>
      </div>
    </div>
  );
};

export default QueryForm;
