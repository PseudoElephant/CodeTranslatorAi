
import MonacoEditor from "@monaco-editor/react";
import { useMonacoThemes } from "../hooks/use-monacothemes";

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

    return (
        <MonacoEditor
            theme="github-light"
            language={props.language}
            value={props.value}
            onChange={handleEditorChange}
            options={{
                minimap: {
                    enabled: false,
                },
                fontFamily: "Fira Code",
                fontLigatures: true,
                readOnly: props.options?.readonly,
                
            }}
        />
    )
}

export default Editor