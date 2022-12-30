
import MonacoEditor, { Monaco, useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect } from "react";

import GithubDark from "../themes/GitHub Dark.json";
import GithubLight from "../themes/GitHub Light.json";
import Github from "../themes/GitHub.json";

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    language?: string;

    options?: {
        readonly?: boolean;
    }
}
  
const Editor: React.FC<Props> = (props) => {
    const monaco = useMonaco()

    useEffect(() => {
        if (monaco) {
            console.log("Monaco Initialized!")
        }
    }, [monaco])

    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            props.onValueChange(value)
        }
    }

    const handleEditorBeforeMount = (monaco: Monaco) => {
       //  Here we can register new languages and stuff
       //  This is just an example, we don't need to do this here
       //  interacting with monaco instance affects all editors
        monaco.editor.defineTheme("github-dark",  GithubDark  as editor.IStandaloneThemeData)
        monaco.editor.defineTheme("github-light", GithubLight as editor.IStandaloneThemeData)
        monaco.editor.defineTheme("github",       Github      as editor.IStandaloneThemeData)
    }

    return (
        <MonacoEditor
            theme="github-light"
            language={props.language}
            value={props.value}
            onChange={handleEditorChange}
            beforeMount={handleEditorBeforeMount}
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