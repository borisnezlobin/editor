import { useContext } from "react";
import { EditorContext, TypingContext } from "../context";
import { Button } from "../utils/button";
import { Code, ListDashes, ListNumbers, TextB, TextHOne, TextHThree, TextHTwo, TextItalic, TextStrikethrough, TextT, TextUnderline } from "@phosphor-icons/react";
import { Separator } from "../utils/separator";
import "../styles/hover.css"
import { unparse } from "./md-parse";
import { headerSizes } from "./EditableMarkdownElement";

export const Toolbar: React.FC = () => {
    const { editorType, fileContent, updateFileContent } = useContext(EditorContext);
    const { typing } = useContext(TypingContext);

    const slapTagsAroundSelection = (tag: string) => {
        const selection = window.getSelection();
        if(selection){
            const range = selection.getRangeAt(0);
            const newNode = document.createElement(tag);
            try{
                range.surroundContents(newNode);
            }catch(e){} // yup
            updateFileContent(unparse(document.getElementById("editor")?.innerHTML || fileContent));
        }
    }

    const slapTagsAroundSelectionWithClass = (tag: string, className: string) => {
        const selection = window.getSelection();
        if(selection){
            const range = selection.getRangeAt(0);
            const newNode = document.createElement(tag);
            newNode.classList.add(...className.split(" "));
            try{
                range.surroundContents(newNode);
            }catch(e){} // yup
            updateFileContent(unparse(document.getElementById("editor")?.innerHTML || fileContent));
        }
    }

    return (
        <div className={`w-full h-12 flex flex-row justify-center items-center fixed bottom-4 z-10 transition ${typing || editorType == "text" ? "pointer-events-none opacity-0" : "opacity-100"}`}>
            <div className="flex flex-row justify-center items-center backdrop-blur bg-white/50 shadow-lg py-1 px-1 rounded-lg border border-gray-200">
                <Button onClick={() => slapTagsAroundSelection("b")}>
                    <TextB className="w-6 h-6" weight="bold" />
                </Button>
                <Button onClick={() => slapTagsAroundSelection("em")}>
                    <TextItalic className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => slapTagsAroundSelection("pre")}>
                    <Code className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => slapTagsAroundSelection("span")}>
                    <TextT className="w-6 h-6" weight="light" />
                </Button>
                <Separator vertical={false} size="medium" />
                <Button onClick={() => {
                    slapTagsAroundSelection("li");
                    slapTagsAroundSelection("ul");
                }}>
                    <ListDashes className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => {
                    slapTagsAroundSelection("li");
                    slapTagsAroundSelection("ol");
                }}>
                    <ListNumbers className="w-6 h-6" weight="light" />
                </Button>
                <Separator vertical={false} />
                <Button onClick={() => slapTagsAroundSelectionWithClass("h1", headerSizes[0] + " font-bold mb-4")}>
                    <TextHOne className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => slapTagsAroundSelectionWithClass("h2", headerSizes[1] + " font-bold mb-4")}>
                    <TextHTwo className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => slapTagsAroundSelectionWithClass("h3", headerSizes[2] + " font-bold mb-4")}>
                    <TextHThree className="w-6 h-6" weight="light" />
                </Button>
            </div>
        </div>
    );
};
