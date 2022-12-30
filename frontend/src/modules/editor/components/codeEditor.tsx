
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("@monaco-editor/react"), { ssr: false });

import FontFaceObserver from 'fontfaceobserver';
import { editor } from "monaco-editor";

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    language?: string;

    options?: {
        readonly?: boolean;
    }
}
  
const Editor: React.FC<Props> = (props) => {
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
        <MonacoEditor
            theme="github-light"
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
    )
}

export default Editor