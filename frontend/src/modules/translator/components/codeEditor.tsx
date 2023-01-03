import React, { useCallback, useEffect } from "react";
import { EditorState } from "@codemirror/state";
import useCodeMirror from "../hooks/use-codemirror";

import { useGlobalStore } from "../../../common/stores/globalStore";
import StringToFunction from "../utils/stringToFunction";

interface Props {
  initialDoc: string;
  onChange: (doc: string) => void;
}

const CodeEditor: React.FC<Props> = (props) => {
  const { onChange, initialDoc } = props;
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange]
  );

  const [refContainer, editorView, languageConf] =
    useCodeMirror<HTMLDivElement>({
      initialDoc: initialDoc,
      onChange: handleChange,
    });

  const language = StringToFunction(useGlobalStore((state) => state.language));

  useEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: languageConf?.reconfigure(language),
      });
    } else {
    }
  }, [language]);

  return (
    <div
      className="w-full h-full flex-grow-0 flex-shrink-0"
      ref={refContainer}
    ></div>
  );
};

export default CodeEditor;
