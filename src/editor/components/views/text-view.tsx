import { Token } from "marked";
import { EditViewProps } from "../../EditViewProps";
import { EditableMarkdownElement } from "../EditableMarkdownElement";
import { mdArray, unparse } from "../../md-parse";
import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TypingContext } from "../../../context";
import { CONFIG } from "../../../utils/config";
import { TextTypingEffect } from "../../../typography/dynamic/text-typing-effect";
import placeholderWords from "../../empty-editor-phrases.json";
import { cleanNewlines, parseInnerText } from "../../../utils/format-utils";

const slapIdOnTokens = (tokens: Token[]): Token[] => {
    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        // red squiggly lines? more like cope harder
        // @ts-ignore
        token.id = uuidv4();
        // @ts-ignore
        if(token.tokens) token.tokens = slapIdOnTokens(token.tokens);
    }

    return tokens;
}

export const TextView: React.FC<EditViewProps> = ({ value, includeMd = false, onChange }) => {
    const [lastKeyStroke, setLastKeyStroke] = useState(Date.now() - CONFIG.TYPING_TIMEOUT - 1);
    const [arr, setArr] = useState([] as Token[]);
    const { typing, focusAllowed, setTyping } = useContext(TypingContext);

    useEffect(() => {
        setArr(slapIdOnTokens(mdArray(value)));
        console.log("updating array");
    }, [value])

    useEffect(() => {
        if(focusAllowed){
            const checker = setInterval(() => {
                // bye-bye battery
                if(Date.now() - lastKeyStroke < CONFIG.TYPING_TIMEOUT) setTyping(true);
                else if(typing){
                    setTyping(false);
                }
            }, 300);

            return () => clearInterval(checker);
        }
    }, [arr, lastKeyStroke, focusAllowed]);

    const container = useRef<HTMLDivElement>(null);

    // typesafe? what's that?
    function updateElementWithId(elements: Token[], id: string, newElement: Token): boolean {
        return elements.some((element, index) => {
            // @ts-ignore
            if(element.id == id) {
                elements[index] = newElement;
                setArr([...arr]);
                return true;
                // @ts-ignore
            } else if(element.tokens) {
                // @ts-ignore
                return updateElementWithId(element.tokens, id, newElement);
            }
            return false;
        });
    }

    return (
        <>
            <div className="w-full h-full overflow-scroll pb-36 pt-4">
                <div
                    className="bg-transparent text-lg px-4 outline-none max-w-5xl mx-auto pb-16 md-container whitespace-pre-line"
                    contentEditable
                    id="editor"
                    suppressContentEditableWarning // yup
                    ref={container}
                    onInput={(e) => {
                        console.log(includeMd ? parseInnerText(e.currentTarget) : unparse(e.currentTarget.innerHTML));
                        // onChange(includeMd ? parseInnerText(e.currentTarget) : cleanNewlines(unparse(e.currentTarget.innerHTML)));
                        setLastKeyStroke(Date.now());
                    }}
                >
                    {arr.map((element, index) => {
                        return (
                            <EditableMarkdownElement
                                key={index}
                                includeMD={includeMd}
                                element={element}
                                updateElement={(id: string, newElement: Token) => updateElementWithId(arr, id, newElement)}
                            />
                        )
                    })}
                </div>
            </div>
            {arr.length == 0 && (
                <div className="fixed w-full select-none top-24">
                    <div className="max-w-5xl mx-auto px-3">
                        <TextTypingEffect texts={placeholderWords} className="text-gray-400 text-left italic text-lg" />
                    </div>
                </div>
            )}
        </>
    )
}