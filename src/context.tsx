import { useState, createContext, useEffect } from "react";
import ChildrenProps from "./utils/children-props";


interface FileUpdateRequest {
    file: string;
    content: string;
}

declare global {
    interface Window {
        api: {
            updateFile: (file: FileUpdateRequest) => void;
            on: (channel: string, callback: any) => void;
            clear: (channel: string) => void;
            count: (channel: string) => number;
            readFileWithPath: (path: string) => string | false;
        };
    }
}

interface TextSelection {
    start: number;
    end: number;
    content: string;
}

type EditorType = "markdown" | "mixed" | "text" | "split";
interface EditorContextType {
    editorType: EditorType;
    setEditorType: (editorType: EditorType) => void;

    file: string | null;
    fileFullName: string;
    fileContent: string;
    setOpenFile: (file: File | null) => void;
    setFile: (name: string, path: string) => Promise<boolean>;
    setFileFullName: (fileFullName: string) => void;
    updateFileContent: (fileContent: string) => void;
}

interface TypingContextType {
    typing: boolean;
    selection: TextSelection;
    focusAllowed: boolean;
    setSelection: (selection: TextSelection) => void;
    setTyping: (typing: boolean) => void;
    setFocusAllowed: (focusAllowed: boolean) => void;
}

export const TypingContext = createContext<TypingContextType>({
    typing: true,
    selection: {
        start: 0,
        end: 0,
        content: ""
    },
    setSelection: () => {},
    setTyping: () => {},
    focusAllowed: true,
    setFocusAllowed: () => {},
});

export const EditorContext = createContext<EditorContextType>({
    editorType: "markdown",
    setEditorType: () => {},

    file: "",
    fileFullName: "",
    fileContent: "",
    setOpenFile: () => {},
    setFile: async (name: string, path: string) => { return true; },
    setFileFullName: () => {},
    updateFileContent: () => {},
});

export const TypingProvider: React.FC<ChildrenProps> = ({ children }) => {
    const [selection, setSelection] = useState<TextSelection>({
        start: 0,
        end: 0,
        content: ""
    });
    const [typing, setTyping] = useState(false);
    const fromSettings = localStorage.getItem("focusAllowed");
    const [focusAllowed, setFocusAllowed] = useState(fromSettings == null ? true : fromSettings == "true");

    return (
        <TypingContext.Provider value={{ typing, selection, focusAllowed, setSelection, setTyping, setFocusAllowed }}>
            {children}
        </TypingContext.Provider>
    );
};

export const EditorProvider: React.FC<ChildrenProps> = ({ children }) => {
    const [file, setFileName] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [fileFullName, setFilePath] = useState("");
    const [editorType, setEditorType] = useState<EditorType>("markdown");

    const setOpenFile = (file: File | null) => {
        if(file == null) {
            setFileName("");
            setFilePath("");
            setFileContent("");
            return;
        }

        setFileName(file.name);
        setFilePath((file as any).path);

        const reader = new FileReader();
        reader.onload = (e) => {
            if(!e.target) return;
            const text = e.target.result;
            // TODO: errors
            if(typeof text != "string") return;
            setFileContent(text.toString());
        }
        reader.readAsText(file);
    }

    const updateFileContent = (fileContent: string) => {
        window.api.updateFile({ file: fileFullName, content: fileContent });
        setFileContent(fileContent);
    }

    const setFile = async (name: string, path: string) => {
        if(name == "" || path == ""){
            setFileName("");
            setFilePath("");
            setFileContent("");
            return true;
        }

        const contents = await window.api.readFileWithPath(path);
        if(contents === false) return false;
        setFileName(name);
        setFilePath(path);
        updateFileContent(contents);
        return true;
    }

    useEffect(() => {
        if(window.api.count("file-contents") > 0) window.api.clear("file-contents");
        // @ts-ignore
        window.api.on("file-contents", (content: string, fileName: string) => {
            // very force, idk
            setFilePath(fileName);
            updateFileContent(content);
        });
    });

    return (
        <EditorContext.Provider value={{ editorType, setEditorType, file, fileFullName, setFile: setFile, setFileFullName: setFilePath, fileContent, setOpenFile, updateFileContent }}>
            {children}
        </EditorContext.Provider>
    );
}