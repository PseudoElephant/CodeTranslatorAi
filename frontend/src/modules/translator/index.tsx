import React, { useCallback, useState } from "react";
import Dropdown from "../../common/components/dropdown";
import CodeEditor from "./components/codeEditor";

const Languages = [
  {
    group_label: "Strong Typed",
    items: [
      { name: "TypeScript", value: "typescript" },
      { name: "Rust", value: "rust" },
      { name: "C++", value: "cplusplus" },
    ],
  },
  {
    group_label: "Weakly Typed",
    items: [
      { name: "JavaScript", value: "javascript" },
      { name: "Python", value: "python" },
    ],
  },
];

const Translator = () => {
  const [doc, setDoc] = useState<string>("# Hello, World!\n");
  const handleDocChange = useCallback((newDoc: string) => {
    setDoc(newDoc);
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
          />
        </div>
        <div className="flex items-center gap-2 col-span-5 col-start-7">
          <p className="text-sm font-bold">To</p>
          <Dropdown
            placeholder="Select a language..."
            ariaLabel="ToLanguage"
            groups={Languages}
          />
        </div>
      </div>
      <div className="w-full h-px bg-neutral-6" />
      <div className="w-full h-80 bg-neutral-2 rounded-md p-3 grid grid-cols-2 gap-3">
        <div className="w-full bg-neutral-3 rounded-md">
          <CodeEditor initialDoc={doc} onChange={handleDocChange} />
        </div>
        <div className="w-full bg-neutral-3 rounded-md"></div>
      </div>
    </div>
  );
};

export default Translator;
