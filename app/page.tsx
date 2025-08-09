"use client"

import React, { useState, useEffect } from "react";
import * as Babel from "@babel/standalone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ErrorDisplay from "@/components/custom/ErrorDisplay";

const placeholder_code = `<div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2 text-gray-800">
      The Coldest Sunset
    </div>
    <p className="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
      quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
      nihil.
    </p>
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      #photography
    </span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      #travel
    </span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      #winter
    </span>
  </div>
  <div className="px-6 py-4">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full">
      Read More
    </button>
  </div>
</div>`;

export default function ReactCanvas() {
  const [code, setCode] = useState(placeholder_code);
  const [workingCode, setWorkingCode] = useState(placeholder_code);
  const [error, setError] = useState(null);
  const [PreviewComponent, setPreviewComponent] = useState(null);
  const [autoPreview, setAutoPreview] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize the preview component on first render
  useEffect(() => {
    generatePreview(placeholder_code);
  }, []);

  const generatePreview = async (codeToRender) => {
    setIsGenerating(true);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      // Transform JSX to JavaScript
      const result = Babel.transform(
        `function Preview(){return (${codeToRender});} Preview;`,
        { presets: ["react"] }
      );

      const transformed = result?.code;
      console.log("Transformed code:", transformed); // Debug log

      if (transformed) {
        // Execute the transformed code and get the component function
        const componentFunction = eval(`(function() { 
          const React = arguments[0]; 
          ${transformed.replace('Preview;', 'return Preview;')} 
        })`)(React);

        console.log("Component function:", componentFunction); // Debug log

        // Verify it's actually a function
        if (typeof componentFunction === 'function') {
          setPreviewComponent(() => componentFunction);
          setError(null);
          setIsGenerating(false);
          return true;
        } else {
          throw new Error("Generated component is not a function");
        }
      }
    } catch (err) {
      console.error("Preview generation error:", err); // Debug log
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setPreviewComponent(null);
      setIsGenerating(false);
      return false;
    }

    setIsGenerating(false);
    return false;
  };

  // Auto-preview when autoPreview is enabled
  useEffect(() => {
    if (autoPreview) {
      generatePreview(code);
      setWorkingCode(code);
    }
  }, [code, autoPreview]);

  const handleGeneratePreview = async () => {
    const success = await generatePreview(code);
    if (success) {
      setWorkingCode(code);
    }
  };

  const handleEditComponent = () => {
    // Reset to last working code or provide editing utilities
    setCode(workingCode);
    setAutoPreview(true);
  };

  const toggleAutoPreview = () => {
    setAutoPreview(!autoPreview);
    if (!autoPreview) {
      generatePreview(code);
      setWorkingCode(code);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="flex flex-col items-center mt-5">
        <h1 className="text-custom-highlight text-3xl font-bold">React Canvas</h1>
        <p className="mt-3 text-md text-white">Edit your Components Visually</p>
      </div>

      <div className="w-full h-full flex flex-row justify-center items-center p-5 gap-x-5">
        <div className="w-1/3 h-full flex flex-col">
          <p className="text-[#93918a] font-medium">Paste your JSX code</p>
          <Textarea
            className="w-full h-full text-white focus-visible:ring-[#93918a] focus-visible:ring-3 focus-visible:border-[#93918a] resize-none font-mono text-sm rounded-lg scrollbar-thumb-rounded-md scrollbar-track-rounded-full scrollbar scrollbar-w-2 scrollbar-thumb-[#93918a] scrollbar-track-slate"
            placeholder={placeholder_code}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="w-2/3 h-full flex flex-col">
          <p className="text-[#93918a] font-medium">Live Preview</p>
          <div className="w-full h-full border-1 rounded-md overflow-auto">
            {isGenerating ? (
              <div className="w-full h-full flex items-center justify-center text-[#93918a]">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#93918a]"></div>
                  <span>Generating preview...</span>
                </div>
              </div>
            ) : error ? (
              <ErrorDisplay error={error} />
            ) : PreviewComponent ? (
              <div className="w-full h-full items-center justify-center flex">
                <PreviewComponent />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#93918a]">
                No component to render
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-5 p-5">
        <Button
          onClick={toggleAutoPreview}
          className={`text-xs px-2 py-1 rounded ${autoPreview
            ? 'bg-green-600 text-white'
            : 'bg-gray-600 text-gray-300'
            }`}
        >
          Auto Generate: {autoPreview ? 'ON' : 'OFF'}
        </Button>
        {!autoPreview && (
          <Button
            onClick={handleGeneratePreview}
            disabled={isGenerating}
            className="bg-custom-highlight hover:bg-custom-highlight/90 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md px-6 py-2 text-white font-medium transition-colors"
          >
            {isGenerating ? "Generating..." : "Generate Preview"}
          </Button>
        )}
        <Button
          onClick={handleEditComponent}
          className="bg-custom-highlight hover:bg-custom-highlight/90 rounded-md px-6 py-2 text-white font-medium transition-colors"
        >
          Edit Component
        </Button>
      </div>
    </div>
  );
}
