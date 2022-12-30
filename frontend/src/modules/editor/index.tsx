import { useMonaco } from "@monaco-editor/react";
import React, { useCallback, useEffect, useState } from "react";
import Dropdown from "../../common/components/dropdown";
import CodeEditor from "./components/codeEditor";

// export hooks
export * from "./hooks/use-monacothemes";

const Languages = [
  {
    group_label: "Strong Typed",
    items: [
      { name: "TypeScript", value: "typescript" },
      { name: "Rust", value: "rust" },
      { name: "C++", value: "cpp" },
      { name: "C#", value: "csharp" },
      { name: "Java", value: "java" },
      { name: "Go", value: "go" },
      { name: "Kotlin", value: "kotlin" },
      { name: "Swift", value: "swift" },
    ],
  },
  {
    group_label: "Weakly Typed",
    items: [
      { name: "JavaScript", value: "javascript" },
      { name: "Python", value: "python" },
      { name: "Ruby", value: "ruby" },
      { name: "PHP", value: "php" },
      { name: "Perl", value: "perl" },
      { name: "Lua", value: "lua" },
    ],
  },
];

const Translator = () => {

  const [codeFrom, setCodeFrom] = useState<string>("# Hello, World!\n");
  const handleChangeFrom = useCallback((newCodeFrom: string) => {
    setCodeFrom(newCodeFrom);
  }, []);

  const [codeTo, setCodeTo] = useState<string>("# Hello, World!\n");
  const handleChangeTo = useCallback((newCodeTo: string) => {
    setCodeTo(newCodeTo);
  }, []);

  const [fromLanguage, setFromLanguage] = useState<string>("typescript");
  const [toLanguage, setToLanguage] = useState<string>("javascript");

  const handleFromLanguageChange = useCallback((newLanguage: string) => {
    setFromLanguage(newLanguage);
  }, []);

  const handleToLanguageChange = useCallback((newLanguage: string) => {
    setToLanguage(newLanguage);
  }, []);
  

  return (
    <div>
      <div className="grid grid-cols-12 bg-neutral-2 rounded-md p-4">
        <div className="flex items-center gap-2 col-span-5">
          <p className="text-sm font-bold">From</p>
          <Dropdown
            placeholder="Select a language..."
            ariaLabel="FromLanguage"
            groups={Languages}
            value={fromLanguage}
            onValueChange={handleFromLanguageChange}
          />
        </div>
        <div className="flex items-center gap-2 col-span-5 col-start-7">
          <p className="text-sm font-bold">To</p>
          <Dropdown
            placeholder="Select a language..."
            ariaLabel="ToLanguage"
            groups={Languages}
            value={toLanguage}
            onValueChange={handleToLanguageChange}
          />
        </div>
      </div>
      <div className="w-full h-px bg-neutral-6" />
      <div className="w-full h-80 bg-neutral-2 rounded-md p-3 grid grid-cols-2 gap-3">
        <div className="w-full bg-neutral-3 rounded-md">
          <CodeEditor value={codeFrom} onValueChange={handleChangeFrom} language={fromLanguage} />
        </div>
        <div className="w-full bg-neutral-3 rounded-md">
          <CodeEditor value={codeTo} onValueChange={handleChangeTo} language={toLanguage} options={{ readonly: true }} />
        </div>
      </div>
    </div>
  );
};

export default Translator;