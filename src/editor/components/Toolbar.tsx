import { useContext, useEffect } from "react";
import { EditorContext, TypingContext } from "../../context";
import { Button } from "../../utils/button";
import { Code, Image, ListDashes, ListNumbers, TextB, TextHFive, TextHFour, TextHOne, TextHSix, TextHThree, TextHTwo, TextItalic, TextStrikethrough, TextT, TextUnderline } from "@phosphor-icons/react";
import { Separator } from "../../utils/separator";
import "../../styles/hover.css"
import { unparse } from "../md-parse";
import { headerSizes } from "./EditableMarkdownElement";
import React from "react";
import { TextButton } from "../../utils/text-button";
import { errorToast } from "../../utils/toast";
import { cleanNewlines } from "../../utils/format-utils";

export const Toolbar: React.FC = () => {
    const { editorType, fileContent, updateFileContent } = useContext(EditorContext);
    const { typing, setTyping } = useContext(TypingContext);
    const [moreToolbarOpen, setMoreToolbarOpen] = React.useState(false);
    const editor = React.useRef<HTMLDivElement | null>(document.getElementById("editor") as HTMLDivElement);
    
    useEffect(() => {
        if(editorType == "text" || editorType == "split") return;
        const tabHandler = (e: KeyboardEvent) => {
            console.log("keyboard event: " + e);
            if(e.key == "Tab"){
                e.preventDefault();
                insertTextAtCursor("\t");
            }
        }
        if(editor.current){
            editor.current.addEventListener("keydown", tabHandler);
        }else{
            editor.current = document.getElementById("editor") as HTMLDivElement;
        }

        return () => {
            if(editor.current){
                editor.current.removeEventListener("keydown", tabHandler);
            }
        }
    }, [editorType, editor]);

    // function getHTMLOfSelection () {
    //     var range;
    //     if (document.selection && document.selection.createRange) {
    //         range = document.selection.createRange();
    //         return range.htmlText;
    //     }else if (window.getSelection) {
    //         var selection = window.getSelection();
    //         if (selection.rangeCount > 0) {
    //             range = selection.getRangeAt(0);
    //             var clonedSelection = range.cloneContents();
    //             var div = document.createElement('div');
    //             div.appendChild(clonedSelection);
    //             return div.innerHTML;
    //         }else{
    //             return '';
    //         }
    //     }else{
    //         return '';
    //     }
    // }

    const slapTagsAroundSelection = (tag: string, className: string) => {
        if (editorType === "text" || editorType === "split") return;
    
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0);
    
            const commonAncestorContainer = range.commonAncestorContainer as Element;
            if (!editor.current || !editor.current.innerHTML.includes(commonAncestorContainer.innerHTML)){
                console.log(editor.current);
                return;
            }

            var newNode = document.createElement(tag);
            if(className != "") newNode.classList.add(...className.split(" "));
    
            if (range.startContainer === range.endContainer) {
                const content = range.extractContents();
                newNode.appendChild(content);
                range.insertNode(newNode);
            } else {
                const fragment = range.cloneContents();
                newNode.appendChild(fragment);
                range.deleteContents();
                range.insertNode(newNode);
            }
            console.log(cleanNewlines(unparse(editor.current.innerHTML)));
            // updateFileContent(unparse(editor?.innerHTML || fileContent));
        }
    };

    const insertTextAtCursor = (text: string) => {
        if(editorType == "text" || editorType == "split") return;
        const selection = window.getSelection();
        if(selection){
            if(!editor.current || !editor.current.contains(selection.anchorNode)) return;
            const range = selection.getRangeAt(0);
            const newNode = document.createTextNode(text);
            try{
                range.insertNode(newNode);
            }catch(e){} // yup
            // updateFileContent(unparse(editor.current?.innerHTML || fileContent));
        }
    }

    const wrapSelectionWithText = (text: string) => {
        if(editorType == "text" || editorType == "split") return;
        const selection = window.getSelection();
        if(selection){
            if(!editor.current) return;
            console.log("wrapping");
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const newText = text + selectedText + text;
            document.execCommand('insertHTML', false, newText);
            // updateFileContent(unparse(editor.current?.innerHTML || fileContent));
        }
    }

    const insertHeader = (header: string) => {
        if(editorType == "mixed") insertTextAtCursor("#".repeat(parseInt(header.split("h")[1])) + " ");
        slapTagsAroundSelection(header, headerSizes[0] + " font-bold mb-4");
    }

    const moreToolbar = (
        <div
            className={`w-full h-12 flex flex-row justify-center items-center fixed z-10 bottom-20 transition ${typing || editorType == "text" ? "opacity-0" : "opacity-100"}`}
        >
            <div className="flex flex-row justify-center items-center backdrop-blur bg-white/50 shadow-lg py-1 px-1 rounded-lg border border-gray-200">
                <Button onClick={() =>  insertHeader("h4")  }>
                    <TextHFour className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() =>  insertHeader("h5")  }>
                    <TextHFive className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => { insertHeader("h6") }}>
                    <TextHSix className="w-6 h-6" weight="light" />
                </Button>
            </div>
        </div>
    );

    return (
        <div
            className={`w-full h-12 flex flex-row justify-center items-center fixed z-[90] bottom-4 transition ${typing || editorType == "text" ? "opacity-0" : "opacity-100"}`}
        >
            <div className="flex flex-row justify-center items-center backdrop-blur bg-white/50 shadow-lg py-1 px-1 rounded-lg border border-gray-200">
                <Button onClick={() =>{
                    if(editorType == "mixed") wrapSelectionWithText("**");
                    slapTagsAroundSelection("b", "")
                }}>
                    <TextB className="w-6 h-6" weight="bold" />
                </Button>
                <Button onClick={() => {
                    if(editorType == "mixed") wrapSelectionWithText("*");
                    slapTagsAroundSelection("em", "")
                }}>
                    <TextItalic className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => {
                    if(editorType == "mixed") wrapSelectionWithText("\n```\n");
                    slapTagsAroundSelection("pre", "")
                }}>
                    <Code className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => {
                    if(editorType == "mixed"){
                        insertTextAtCursor("![alt text](image_url)");
                    }else{
                        errorToast("Inserting images in Markdown mode is not supported yet.");
                    }
                }}>
                    <Image className="w-6 h-6" weight="light" />
                </Button>
                <Separator vertical={false} size="medium" />
                <Button onClick={() => {
                    slapTagsAroundSelection("li", "");
                    slapTagsAroundSelection("ul", "");
                }}>
                    <ListDashes className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => {
                    if(editorType == "mixed") insertTextAtCursor("\t- ");
                    slapTagsAroundSelection("li", "");
                    slapTagsAroundSelection("ol", "");
                }}>
                    <ListNumbers className="w-6 h-6" weight="light" />
                </Button>
                <Separator vertical={false} />
                <Button onClick={() => insertHeader("h1")}>
                    <TextHOne className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => insertHeader("h2")}>
                    <TextHTwo className="w-6 h-6" weight="light" />
                </Button>
                <Button onClick={() => insertHeader("h3")}>
                    <TextHThree className="w-6 h-6" weight="light" />
                </Button>
                <Separator vertical={false} />
                <TextButton onClick={() => { setMoreToolbarOpen(!moreToolbarOpen) }} className={`mr-1 ${moreToolbarOpen ? "bg-gray-100" : ""}`}>
                    More
                </TextButton>
            </div>
            {moreToolbarOpen && moreToolbar}
        </div>
    );
};
