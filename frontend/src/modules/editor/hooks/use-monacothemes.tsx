import { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef } from "react";

import GithubDark from "../themes/GitHub Dark.json";
import GithubLight from "../themes/GitHub Light.json";
import Github from "../themes/GitHub.json";

export function useMonacoThemes() {
  const monaco = useMonaco();
  const themesDefined = useRef<Boolean>(false);

  useEffect(() => {
    if (!monaco || themesDefined.current) {
      return;
    }

    console.log("Defining themes");

    monaco.editor.defineTheme("github-dark", GithubDark as editor.IStandaloneThemeData);
    monaco.editor.defineTheme("github-light", GithubLight as editor.IStandaloneThemeData);
    monaco.editor.defineTheme("github", Github as editor.IStandaloneThemeData);

    themesDefined.current = true;
  }, [monaco]);
}
