import { Token } from "marked";
import { ArrowSquareOut, Check, Copy, PencilLine, X } from "@phosphor-icons/react";
import { v4 as uuidv4 } from 'uuid';
import { deEscape } from "./md-parse";
import { UnstyledText } from "../typography/UnstyledText";
import { TextButton } from "../utils/text-button";
import { Separator } from "../utils/separator";
import { successToast } from "../utils/toast";
import { Modal } from "../utils/modal";
import { useState } from "react";
import { DynamicHeader } from "../typography/dynamic/dheader";
import React from "react";

interface MarkdownElementProps {
    element: Token;
    includeMD?: boolean;
    updateElement: (id: string, newElement: Token) => void;
};

interface TableCell {
    text: string;
    tokens: Token[];
};

interface ListItem {
    type: 'list_item';
    raw: string;
    task: boolean;
    checked?: boolean | undefined;
    loose: boolean;
    text: string;
    tokens: Token[];
};

export const headerSizes = [
    "text-4xl border-b-2 border-gray-200",
    "text-3xl border-b-2 border-gray-200",
    "text-2xl border-b-2 border-gray-200",
    "text-xl",
    "text-lg",
    "text-base"
]

export const EditableMarkdownElement: React.FC<MarkdownElementProps> = ({ element, includeMD = false, updateElement }) => {
    const props = {
        // contentEditable: true,
        className: "outline-none blur-on-unfocus",
        suppressContentEditableWarning: true,
    };

    const [linkEditModalOpen, setLinkEditModalOpen] = useState(false);
    const [linkTitle, setLinkTitle] = useState(element.type == "link" ? element.text : "");
    const [linkHref, setLinkHref] = useState(element.type == "link" ? element.href : "");


    // @ts-ignore
    const id = element.id ? element.id : "no id" + uuidv4();

    if(element.type === "paragraph"){
        return (
            <p {...props}>
                {element.tokens?.map((token: Token, index: number) =>
                    <EditableMarkdownElement
                        key={index}
                        element={token}
                        includeMD={includeMD}
                        updateElement={updateElement}
                    />
                )}
            </p>
        )
    }

    if(element.type == "heading"){
        if(element.text.trim() == "") return <></>;
        return <DynamicHeader depth={element.depth} text={element.text} includeMD={includeMD} props={props} />;
    }

    if(element.type == "code"){
        if(element.text == "") return <></>;
        return (
            <pre aria-details={element.lang} {...props}>
                ```{element.lang}<br />
                {deEscape(element.text)}<br />
                ```
            </pre>
        )
    }

    if(element.type == "codespan"){
        if(element.text == "") return <></>;
        return (
            <code {...props}>{includeMD ? "`" : ""}{deEscape(element.text)}{includeMD ? "`" : ""}</code>
        )
    }

    if(element.type === "text"){
        if(element.text == "") return <></>;
        return (
            <span {...props}>{deEscape(element.text)}</span>
        )
    }

    if(element.type === "strong"){
        if(element.text == "") return <></>;
        if(element.text.trim() == "") return <span>{element.text}</span>;
        return (
            <strong {...props}>
                {includeMD ? "**" : ""}
                {element.tokens?.map((token: Token, index: number) =>
                    <EditableMarkdownElement
                        key={index}
                        includeMD={includeMD}
                        element={token}
                        updateElement={updateElement}
                    />
                )}
                {includeMD ? "**" : ""}
            </strong>
        )
    }

    if(element.type === "em"){
        if(element.text == "") return <></>;
        if(element.text.trim() == "") return <span>{element.text}</span>;
        return (
            <em {...props}>
                {includeMD ? "*" : ""}
                {element.tokens?.map((token: Token, index: number) =>
                    <EditableMarkdownElement
                        key={index}
                        element={token}
                        includeMD={includeMD}
                        updateElement={updateElement}
                    />
                )}
                {includeMD ? "*" : ""}
            </em>
        )
    }

    if(element.type === "blockquote"){
        return (
            <>
                <blockquote {...props} className={props.className + " text-slate-600 rounded-r-lg text-sm p-2 " + (includeMD ? "" : "pl-4 border-l-4 border-gray-200")}>
                    {element.tokens?.map((token: Token, index: number) => {
                        if(includeMD){
                            return (
                                <div key={index} className="flex flex-row gap-2 items-start">
                                    <span className="text-slate-600 border-r-4 pr-2 border-gray-200" contentEditable={false}>{"> "}</span>
                                    {/* <div className="bg-gray-900 h-full w-px p-px" /> */}
                                    <EditableMarkdownElement
                                        key={index}
                                        element={token}
                                        includeMD={includeMD}
                                        updateElement={updateElement}
                                    />
                                </div>
                            )
                        }
                        return (
                            <>
                                <EditableMarkdownElement
                                    key={index}
                                    element={token}
                                    includeMD={includeMD}
                                    updateElement={updateElement}
                                />
                            </>
                        );
                    })}
                </blockquote>
            </>
        )
    }

    if(element.type === "br"){
        return <br />;
    }

    if(element.type === "hr"){
        if(includeMD) return <UnstyledText className="text-center w-full">* * *</UnstyledText>;
        return <hr />;
    }

    if(element.type === "space"){
        return <div contentEditable={false} className="h-4" />;
    }

    if(element.type == "image"){
        return <img src={element.href} alt={deEscape(element.text)} title={element.title} />;
    }

    if(element.type == "list"){
        if(element.ordered){
            return (
                <ol {...props} type="1" style={{ listStyleType: includeMD ? "none" : "initial" }}>
                    {element.items?.map((item: ListItem, index: number) => (
                        <li key={index} {...props}>
                            {includeMD ? index + 1 + ". " : ""}
                            {item.tokens?.map((token: Token, index: number) => (
                                <EditableMarkdownElement
                                    key={index}
                                    includeMD={includeMD}
                                    element={token}
                                    updateElement={updateElement}
                                />
                            ))}
                        </li>
                    ))}
                </ol>
            );
        }
        
        return (
            <ul {...props} style={{ listStyleType: includeMD ? "none" : "disc" }}>
                {element.items?.map((item: ListItem, index: number) => (
                    <li key={index} {...props} >
                        {includeMD ? "- " : ""}
                        {item.tokens?.map((token: Token, index: number) => (
                            <EditableMarkdownElement
                                key={index}
                                includeMD={includeMD}
                                element={token}
                                updateElement={updateElement}
                            />
                        ))}
                    </li>
                ))}
            </ul>
        );
    }

    if(element.type == "link"){
        const copyURL = () => {
            navigator.clipboard.writeText(element.href);
            successToast("Copied URL to clipboard!");
        }
        const openURL = () => {
            // open element.href in new tab
            window.open(element.href);
        }
        const dropdownElement = (
            <aside contentEditable={false} className="dropdown-content font-normal text-xs flex flex-col items-center bg-white/50 w-96 border border-gray-200 backdrop-blur min-w-fit">
                <UnstyledText onClick={openURL} className="w-full link text-center cursor-pointer">
                    {linkHref}
                </UnstyledText>
                <span className="w-full h-px bg-gray-400 m-3" />
                <span className="flex flex-row justify-start items-center gap-2 text-gray-600 font-normal">
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={copyURL}>
                        <Copy className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={() => setLinkEditModalOpen(true)}>
                        <PencilLine className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                    <Separator vertical={false} size="small" />
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={openURL}>
                        <ArrowSquareOut className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                </span>
            </aside>
        );

        const modal = (
            <Modal open={linkEditModalOpen} contentEditable={false}>
                <aside contentEditable={false}>
                    <UnstyledText className="text-xl font-bold mb-4">Edit Link</UnstyledText>
                    <Separator vertical={true} size="small" />
                    <div className="h-4" />
                    <input
                        value={linkHref}
                        onChange={(e) => setLinkHref(e.target.value)}
                        placeholder="Where should this link go?"
                        className="w-full p-2 rounded border bg-white/0 focus:bg-white/50 border-gray-200 focus:border-gray-400 outline-none"
                    />
                    <input
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="What should this link say?"
                        className="w-full p-2 rounded border bg-white/0 focus:bg-white/50 text-black border-gray-200 focus:border-gray-400 outline-none"
                    />
                    <div className="w-full flex flex-row justify-between items-center">
                        <UnstyledText>
                            <TextButton className="w-full mt-2 text-center" onClick={() => setLinkEditModalOpen(false)}>
                                <X className="w-4 h-4 mr-2" weight="bold" />
                                Cancel
                            </TextButton>
                        </UnstyledText>
                        <UnstyledText>
                            <TextButton className="w-full mt-2 text-center" onClick={() => setLinkEditModalOpen(false)}>
                                <Check className="w-4 h-4 mr-2" weight="bold" />
                                Update
                            </TextButton>
                        </UnstyledText>
                    </div>
                </aside>
            </Modal>
        );

        if(includeMD){
            return (
                // @ts-ignore
                <span {...props} aria-description={deEscape(linkTitle)} className={props.className + " link focus-dropdown"} href={linkHref}>
                    [{deEscape(linkTitle)}]({deEscape(linkHref)})
                    {dropdownElement}
                    {modal}
                </span>
            );
        }

        return (
            // @ts-ignore
            <span {...props} aria-description={deEscape(linkTitle)} className={props.className + " link focus-dropdown"} href={linkHref}>
                {deEscape(linkTitle)}
                {dropdownElement}
                {modal}
            </span>
        );
    }
};