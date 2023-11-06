import { Token } from "marked";
import { ArrowSquareOut, Copy, PencilLine } from "@phosphor-icons/react";
import { v4 as uuidv4 } from 'uuid';
import { deEscape } from "./md-parse";
import { UnstyledText } from "../typography/UnstyledText";
import { TextButton } from "../utils/text-button";
import { Separator } from "../utils/separator";
import toast from "react-hot-toast";
import { successToast } from "../utils/toast";

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
    "text-4xl pb-2 border-b border-gray-300", "text-3xl pb-2 border-b border-gray-200", "text-2xl pb-1 border-b border-gray-100", "text-xl", "text-lg", "text-base"];

export const EditableMarkdownElement: React.FC<MarkdownElementProps> = ({ element, includeMD = false, updateElement }) => {
    const props = {
        // contentEditable: true,
        className: "outline-none blur-on-unfocus",
        suppressContentEditableWarning: true,
    };


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
        if(element.depth == 1){
            return (
                <>
                    <h1 {...props} className={`${headerSizes[element.depth]} font-bold mb-4`}>
                        {includeMD ? "# " : ""}{deEscape(element.text)}
                    </h1>
                    {/* <aside><hr className="mb-4" contentEditable={false} /></aside> */}
                </>
            );
        }else if (element.depth == 2){
            return (
                <>
                    <h2 {...props} className={`${headerSizes[element.depth]} font-bold mb-4`}>
                        {includeMD ? "## " : ""}{deEscape(element.text)}
                    </h2>
                    {/* <aside><hr className="mb-4" contentEditable={false} /></aside> */}
                </>
            );
        } else if (element.depth == 3){
            return (
                <h3 {...props} className={`${headerSizes[element.depth]} font-bold mb-4`}>
                    {includeMD ? "### " : ""}{deEscape(element.text)}
                </h3>
            );
        }else if(element.depth == 4){
            return (
                <h4 {...props} className={`${headerSizes[element.depth]} font-bold mb-4`}>
                    {includeMD ? "#### " : ""}{deEscape(element.text)}
                </h4>
            );
        } else if(element.depth == 5){
            return (
                <h5 {...props} className={`${headerSizes[element.depth]} font-bold mb-4`}>
                    {includeMD ? "##### " : ""}{deEscape(element.text)}
                </h5>
            );
        }else{
            return (
                <h6 {...props} className={`${headerSizes[element.depth]} font-bold mb-4`}>
                    {includeMD ? "###### " : ""}{deEscape(element.text)}
                </h6>
            );
        }
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
                <blockquote {...props} className={props.className + " text-slate-600  rounded-r-lg text-sm border-l-4 border-gray-200 p-2 pl-4"}>
                    {element.tokens?.map((token: Token, index: number) => {
                        return (
                            <>
                                {includeMD ? "> " : ""}
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
                <ol {...props} type="1">
                    {element.items?.map((item: ListItem, index: number) => (
                        <li key={index} {...props}>
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
            <ul {...props} className={props.className + (includeMD ? " list-[-]" : "")}>
                {element.items?.map((item: ListItem, index: number) => (
                    <li key={index} {...props} >
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
                    {element.href}
                </UnstyledText>
                <span className="w-full h-px bg-gray-400 m-3" />
                <span className="flex flex-row justify-start items-center gap-2 text-gray-600 font-normal">
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={copyURL}>
                        <Copy className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2">
                        <PencilLine className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                    <Separator vertical={false} size="small" />
                    <UnstyledText className="hover:bg-gray-200 cursor-pointer rounded p-2" onClick={openURL}>
                        <ArrowSquareOut className="w-4 h-4 text-gray-600" weight="light" />
                    </UnstyledText>
                </span>
            </aside>
        );

        if(includeMD){
            return (
                // @ts-ignore
                <span {...props} aria-description={deEscape(element.text)} className={props.className + " link focus-dropdown"} href={element.href}>
                    [{deEscape(element.text)}]({deEscape(element.href)})
                    {dropdownElement}
                </span>
            );
        }

        return (
            // @ts-ignore
            <span {...props} aria-description={deEscape(element.text)} className={props.className + " link focus-dropdown"} href={element.href} onClick={() => window.open(element.href)}>
                {deEscape(element.text)}
                {dropdownElement}
            </span>
        );
    }
};