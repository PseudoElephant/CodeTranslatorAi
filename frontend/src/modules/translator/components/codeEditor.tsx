import React, { useCallback, useEffect } from "react";
import { EditorState } from "@codemirror/state";
import useCodeMirror from "../hooks/use-codemirror";

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

  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: initialDoc,
    onChange: handleChange,
  });

  useEffect(() => {
    if (editorView) {
    } else {
    }
  }, [editorView]);

  return (
    <div
      className="w-full h-full flex-grow-0 flex-shrink-0"
      ref={refContainer}
    ></div>
  );
};

export default CodeEditor;
