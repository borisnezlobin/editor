import { useContext } from "react";
import { EditorContext, TypingContext } from "../context";
import { FileText, FileX } from "@phosphor-icons/react";
import { Separator } from "./separator";
import { Muted } from "../typography/muted";


export const Frame: React.FC = () => {
    const { typing, setTyping } = useContext(TypingContext);
    const { file } = useContext(EditorContext);

    return (
        <div
            className={`draggable transition w-full h-10 flex fixed bg-white z-10 flex-row justify-center ${typing ? "secondary-text" : "text-black"} gap-2 items-center`}
        >
            {file == "" ?
                <FileX className="w-6 h-6" weight="light" /> :
                <FileText className="w-6 h-6" weight="light" />    
            }
            <p>{file == "" ? "No file selected" : file}</p>
        </div>
    )
}