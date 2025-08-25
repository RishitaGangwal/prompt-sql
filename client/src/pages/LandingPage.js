import React, { useState, useEffect } from "react";
import { useScrollTrigger } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-[calc(100vh-110px)] w-full flex items-center justify-center bg-slate-100 px-1 xs:px-2 sm:px-4 lg:px-8">
      <div className="w-full text-center">
        <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-slate-200 border border-slate-300 rounded-full text-xs sm:text-sm text-slate-600 font-medium mb-4 sm:mb-6 backdrop-blur-sm">
          <span className="mr-2">✨</span>
          AI-Powered SQL Assistant
        </div>

        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 leading-tight px-1">
          Generate & Understand
          <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent block mt-1">
            SQL Queries
          </span>
        </h1>

        <p className="text-xs xs:text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-slate-600 mx-auto leading-relaxed px-2 sm:px-0">
          Generate SQL queries from natural language descriptions or get
          detailed explanations for existing queries.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/login"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-4 xs:px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs xs:text-sm sm:text-base  sm:w-auto mx-2 sm:mx-0 sm:min-w-48 inline-block text-center"
          >
            Try PromptSQL Free
          </a>
        </div>

        <div className="absolute top-10 sm:top-20 left-2 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-2 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-purple-500/10 rounded-full blur-xl sm:blur-2xl"></div>
      </div>
    </div>
  );
};

export default LandingPage;
