import { Token } from "marked";
import { ArrowSquareOut, Check, Copy, PencilLine, X } from "@phosphor-icons/react";
import { v4 as uuidv4 } from 'uuid';
import { deEscape } from "../md-parse";
import { highlightAll, highlightAllUnder } from "prismjs";
import { UnstyledText } from "../../typography/UnstyledText";
import { TextButton } from "../../utils/text-button";
import { Separator } from "../../utils/separator";
import { errorToast, successToast } from "../../utils/toast";
import { Modal } from "../../utils/modal";
import { useEffect, useRef, useState } from "react";
import { DynamicHeader } from "../../typography/dynamic/dheader";
import React from "react";
import { Muted } from "../../typography/muted";

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

const blockElements = ["paragraph", "h1", "h2", "h3", "h4", "h5", "h6", "code", "list", "space", "list_item", "blockquote"];
const prependables = ["-", ">"];

// ho li fuk this is a mess
// even I no longer have a clue wtf this does
// it kinda works when I don't think about it too hard so uh
const prepend = (token: Token, str: string, parent: string) => {
    // if(token.type == "list") console.log(token);
    const newToken = { ...token };
    // yeah I cannot be bothered to fix the ts rn and I don't think I ever will be :heart_hands:


    // currently broken with lists inside of blockquotes (- > becomes - > >, becomes - > > >, etc. on every keypress)


    // @ts-ignore
    if(token.tokens && !token.quoted){
        for(var i = 0; i < token.tokens.length; i++){
            // @ts-ignore
            newToken.tokens[i] = prepend(token.tokens[i], str, i == 0 ? newToken.type : "");
        }
        // @ts-ignore
        // if(blockElements.includes(newToken.tokens[0].type) && newToken.tokens[0].text && !newToken.tokens[0].text.startsWith("> ")){
        //     newToken.tokens[0].text = str + token.tokens[0].text;
        // }
        newToken.quoted = true;
    }else if(token.type == "list"){
        // @ts-ignore
        for(var i = 0; i < token.items.length; i++){
            // @ts-ignore
            newToken.items[i] = prepend(token.items[i], str, i == 0 ? newToken.type : "");
        }
    }else{
        const hasStrPrepended = (text: string) => {
            const words = text.split(" ");
            // console.log("considering \"" + text + "\"");
            if(words.length == 0) return false;
            for(var i = 0; i < words.length; i++){
                // console.log("now considering if \"" + str + "\" includes \"" + words[i] + "\"");
                if(words[i].trim() == "") continue;
                if(!prependables.includes(words[i])) return false;
                else if(str.includes(words[i])) return true; // whatever, I think it makes sense
            }
            return false;
        }

        const appendStrToPrepended = (tokens: Token[], str: string) => {
            // append { raw: str, text: str, type: "text" } after all the already-prepended tokens
            // @ts-ignore
            const newTokens = [...tokens];
            for(var i = 0; i < tokens.length; i++){
                console.log("considering \"" + tokens[i].text + "\"");
                // @ts-ignore
                if(tokens[i].text && prependables.includes(tokens[i].text.trim())) continue;
                newTokens.splice(i, 0, { raw: str, text: str, type: "text" });
                break;
            }
            return newTokens;
        }

        if((blockElements.includes(newToken.type) || (newToken.type == "text" && blockElements.includes(parent))) && (
            (newToken.text && !hasStrPrepended(newToken.text)) ||
            (newToken.raw && !hasStrPrepended(newToken.raw))
        )){
            if(newToken.tokens) newToken.tokens = appendStrToPrepended(newToken.tokens, str);
            // [{ raw: str, text: str, type: "text" }, ...newToken.tokens];
            if(newToken.raw) newToken.raw = str + token.raw;
            if(newToken.text) newToken.text = str + token.text;
            // newToken.text = str + token.text;
            // newToken.raw = str + token.raw;
        }
    }
    // if(str === "> ") console.log(newToken);
    // console.log(newToken);

    return newToken;
}


// r/badcode
export const EditableMarkdownElement: React.FC<MarkdownElementProps> = ({ element, includeMD = false, updateElement }) => {
    const props = {
        // contentEditable: true,
        className: "outline-none blur-on-unfocus",
        suppressContentEditableWarning: true,
    };

    const [editModalOpen, setEditModalOpen] = useState(false);
    var _title = "";
    var _href = "";
    if(element.type == "link"){
        _title = element.title;
        _href = element.href;
    }else if(element.type == "image"){
        _title = element.text;
        _href = element.href;
    }
    const [editTitle, setEditTitle] = useState(_title);
    const [editHref, setEditHref] = useState(_href);


    // @ts-ignore
    const id = element.id ? element.id : "no id" + uuidv4();

    useEffect(() => {
        highlightAll();
    }, []);

    if(element.type === "paragraph"){
        return (
            <>
                <span {...props}>
                    {element.tokens?.map((token: Token, index: number) =>
                        <EditableMarkdownElement
                            key={index}
                            element={token}
                            includeMD={includeMD}
                            updateElement={updateElement}
                        />
                    )}
                </span>
                <br />
            </>
        )
    }

    if(element.type == "heading"){
        if(element.text.trim() == "") return <></>;
        return <DynamicHeader depth={element.depth} text={element.text} includeMD={includeMD} props={props} />;
    }

    if(element.type == "code"){
        if(element.text == "") return <></>;
        if(includeMD) return (
            <div {...props} className="bg-[#f1f1f1] rounded-lg p-2 monospace text-sm my-4 overflow-x-auto">
                <span className="text-green-700">```{element.lang + "\n"}</span>
                <pre className="p-0 overflow-visible">
                    <code className={`language-${element.lang}`}>
                    {deEscape(element.text) + "\n"}
                    </code>
                </pre>
                <span className="text-green-700">```</span>
            </div>
        )
        return (
            <pre aria-details={element.lang} {...props} className="bg-[#f1f1f1] text-sm overflow-x-auto monospace rounded-lg">
                <code className={`language-${element.lang}`}>
                {deEscape(element.text) + "\n"}
                </code>
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
                <blockquote {...props} className={props.className + " text-slate-600 rounded-r-lg text-sm p-2 pl-4 border-l-4 border-gray-200"}>
                    {element.tokens?.map((token: Token, index: number) => {
                        if(includeMD){
                            return (
                                <>
                                 {/* <div key={index} className="flex flex-row gap-2 items-start"> */}
                                    {/* <span className="text-slate-600 border-r-4 pr-2 border-gray-200" contentEditable={false}>{"> "}</span> */}
                                    {/* <div className="bg-gray-900 h-full w-px p-px" /> */}
                                    {"> "}
                                    {token.type == "space" ? <br /> :
                                    <EditableMarkdownElement
                                        key={index}
                                        element={token}
                                        includeMD={includeMD}
                                        updateElement={updateElement}
                                    />
                            }
                                </>
                                // </div>
                            )
                        }
                        return (
                            <>
                                {/* {includeMD ? "> " : ""} */}
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
                <br />
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
        return <div contentEditable={false} className="h-4">{element.raw}</div>;
    }

    if(element.type == "image"){
        const modalElement = (
            <Modal open={editModalOpen} contentEditable={false}>
                <aside contentEditable={false}>
                    <UnstyledText className="text-xl font-bold mb-4">Edit Image</UnstyledText>
                    <Separator vertical={true} size="xlarge" />
                    <div className="h-4" />
                    <input
                        value={editHref}
                        onChange={(e) => setEditHref(e.target.value)}
                        placeholder="Where should this image go?"
                        className="w-full p-2 rounded border link hover:no-underline bg-white/0 focus:bg-white/50 border-gray-200 focus:border-gray-400 outline-none"
                    />
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="What should this image say?"
                        className="w-full p-2 rounded border bg-white/0 focus:bg-white/50 text-black border-gray-200 focus:border-gray-400 outline-none"
                    />
                    <div className="w-full flex flex-row justify-between items-center">
                        <UnstyledText>
                            <TextButton className="w-full mt-2 text-center" onClick={() => setEditModalOpen(false)}>
                                <X className="w-4 h-4 mr-2" weight="bold" />
                                Cancel
                            </TextButton>
                        </UnstyledText>
                        <UnstyledText>
                            <TextButton className="w-full mt-2 text-center" onClick={() => setEditModalOpen(false)}>
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
                <div className="w-full flex flex-col justify-center items-center bg-gray-100 rounded-lg p-2 focus-dropdown" contentEditable={true}>
                    <Muted {...props} aria-description={deEscape(element.text)} className={props.className} href={editHref}>
                        ![{deEscape(element.text)}]({deEscape(editHref)})
                    </Muted>
                    <aside contentEditable={false} className="dropdown-content font-normal text-xs flex flex-col items-center bg-white/50 w-96 border border-gray-200 backdrop-blur gap-2 min-w-fit">
                        <img src={editHref} alt={deEscape(element.text)} title={editTitle} height={150} className="h-36"/>
                        <UnstyledText className="w-full link text-center cursor-pointer" onClick={() => window.open(element.href, "blank")}>
                            {editHref}
                        </UnstyledText>
                    </aside>
                </div>
            );
        }
        return (
            <div className="p-2 bg-gray-50 rounded-lg flex flex-row justify-center items-center focus-dropdown">
                <img contentEditable={false} src={editHref} alt={editTitle} title={editTitle}/>
                <aside contentEditable={false} className="dropdown-content font-normal text-xs flex flex-col items-center bg-white/50 w-96 border border-gray-200 backdrop-blur min-w-fit">
                    <UnstyledText>
                        {editTitle}
                    </UnstyledText>
                    <UnstyledText className="w-full link text-center cursor-pointer" onClick={() => window.open(element.href, "blank")}>
                        {editHref}
                    </UnstyledText>
                    <span className="w-full h-px bg-gray-400 m-3" />
                    <span className="flex flex-row justify-start items-center gap-2 text-gray-600 font-normal">
                        <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={async () => {
                            try{
                                await navigator.clipboard.writeText(element.href);
                                successToast("Copied URL to clipboard!");
                            }catch(e){
                                errorToast("Failed to copy URL to clipboard.");
                            }
                        }}>
                            <Copy className="w-4 h-4 text-gray-600" weight="light" />
                        </UnstyledText>
                        <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={() => setEditModalOpen(true)}>
                            <PencilLine className="w-4 h-4 text-gray-600" weight="light" />
                        </UnstyledText>
                        <Separator vertical={false} size="small" />
                        <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={() => window.open(element.href, "blank")}>
                            <ArrowSquareOut className="w-4 h-4 text-gray-600" weight="light" />
                        </UnstyledText>
                    </span>
                </aside>
                {modalElement}
            </div>
        );
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
            <>
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
                <br />
            </>
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
                    {editHref}
                </UnstyledText>
                <span className="w-full h-px bg-gray-400 m-3" />
                <span className="flex flex-row justify-start items-center gap-2 text-gray-600 font-normal">
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={copyURL}>
                        <Copy className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={() => setEditModalOpen(true)}>
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
            <Modal open={editModalOpen} contentEditable={false}>
                <aside contentEditable={false}>
                    <UnstyledText className="text-xl font-bold mb-4">Edit Link</UnstyledText>
                    <Separator vertical={true} size="xlarge" />
                    <div className="h-4" />
                    <input
                        value={editHref}
                        onChange={(e) => setEditHref(e.target.value)}
                        placeholder="Where should this link go?"
                        className="w-full p-2 rounded border bg-white/0 focus:bg-white/50 border-gray-200 focus:border-gray-400 outline-none"
                    />
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="What should this link say?"
                        className="w-full p-2 rounded border bg-white/0 focus:bg-white/50 text-black border-gray-200 focus:border-gray-400 outline-none"
                    />
                    <div className="w-full flex flex-row justify-between items-center">
                        <UnstyledText>
                            <TextButton className="w-full mt-2 text-center" onClick={() => setEditModalOpen(false)}>
                                <X className="w-4 h-4 mr-2" weight="bold" />
                                Cancel
                            </TextButton>
                        </UnstyledText>
                        <UnstyledText>
                            <TextButton className="w-full mt-2 text-center" onClick={() => setEditModalOpen(false)}>
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
                <span {...props} aria-description={deEscape(editTitle)} className={props.className + " link focus-dropdown"} href={editHref}>
                    [{deEscape(editTitle)}]({deEscape(editHref)})
                    {dropdownElement}
                    {modal}
                </span>
            );
        }

        return (
            // @ts-ignore
            <span {...props} aria-description={deEscape(editTitle)} className={props.className + " link focus-dropdown"} href={editHref}>
                {deEscape(editTitle)}
                {dropdownElement}
                {modal}
            </span>
        );
    }
};