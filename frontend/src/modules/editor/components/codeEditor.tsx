
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("@monaco-editor/react"), { ssr: false });

import { useMonacoThemes } from "../hooks/use-monacothemes";

import FontFaceObserver from 'fontfaceobserver';
import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import SpinnerLoader from "../../../common/components/spinner";

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    language?: string;
    loading?: boolean;
    options?: {
        readonly?: boolean;
    }
}
  
const Editor: React.FC<Props> = (props) => {
    useMonacoThemes();

    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            props.onValueChange(value)
        }
    }

    const onEditorDidMount = async (_editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        const font = new FontFaceObserver("Fira Code");
        try { 
        await font.load();
            monaco.editor.remeasureFonts();
        }
        catch (e) {
            console.error("Failed to load font `Fira Code`")
        }
    }

    return (
        props.loading ? ( 
            <div className="h-full w-full flex items-center justify-center">
               <SpinnerLoader size="large"/>
            </div>
        ) :
        ( <MonacoEditor
                theme="github-dark"
                language={props.language}
                value={props.value}
                onChange={handleEditorChange}
                onMount={onEditorDidMount}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    fontFamily: "Fira Code",
                    fontLigatures: true,
                    readOnly: props.options?.readonly,
                    tabSize: 4,
                    cursorStyle: "line",
                    formatOnPaste: true,
                    formatOnType: true,
                    wordWrap: "on",
                    autoIndent: "full",
                    insertSpaces: true,
                    renderValidationDecorations: "off",
                }}
            />    
            ))
}

export default Editor
