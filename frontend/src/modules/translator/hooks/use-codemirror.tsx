import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { language } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { basicSetup } from "codemirror";
import { useGlobalStore } from "../../../common/stores/globalStore";

interface Props {
  initialDoc: string;
  onChange?: (state: EditorState) => void;
}

const languageConf = new Compartment();

/* Testing Custom Extensions */
// const toLanguage = EditorState.transactionExtender.of((tr) => {
//   if (!tr.docChanged) return null;
//   let newLanguage;

//   switch (fromLanguage) {
//     case "javascript":
//       newLanguage = javascript();
//       break;
//     default:
//       newLanguage = html();
//       break;
//   }

//   let docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100));
//   let stateIsHTML = tr.startState.facet(language) == htmlLanguage;

//   return {
//     effects: languageConf.reconfigure(newLanguage),
//   };
// });

const useCodeMirror = <T extends Element>(
  props: Props
): [React.MutableRefObject<T | null>, EditorView?, Compartment?] => {
  const refContainer = useRef<T>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const { onChange } = props;

  useEffect(() => {
    if (!refContainer.current) return;

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        languageConf.of(javascript()),
        // toLanguage,
        oneDark,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
    return () => {
      view.destroy();
    };
  }, [refContainer]);

  return [refContainer, editorView, languageConf];
};

export default useCodeMirror;
