import { Token, TokensList } from "marked";
import { EditViewProps } from "./EditViewProps";
import { EditableMarkdownElement } from "./EditableMarkdownElement";
import { mdArray, unparse } from "./md-parse";
import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TypingContext } from "../context";
import { CONFIG } from "../utils/config";

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

const parseInnerText = (element: HTMLElement): string => {
    // clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    // remove all <aside> elements, along with their children
    const asides = clone.querySelectorAll('aside');
    asides.forEach(aside => aside.remove());
    
    // add a newline character between each block-level element
    const blockElements = clone.querySelectorAll('p, div, pre, blockquote');
    blockElements.forEach(blockElement => blockElement.textContent += '\n');

    return clone.innerText;
}

export const TextView: React.FC<EditViewProps> = ({ value, includeMd = false, onChange }) => {
    const [lastKeyStroke, setLastKeyStroke] = useState(Date.now() - CONFIG.TYPING_TIMEOUT - 1);
    const [arr, setArr] = useState([] as Token[]);
    const { typing, focusAllowed, setTyping } = useContext(TypingContext);

    useEffect(() => {
        if(arr.length == 0 && value) {
            setArr(slapIdOnTokens(mdArray(value)));
        }

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
    }, [value, arr, lastKeyStroke, focusAllowed]);

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
                    className="bg-transparent text-lg px-4 outline-none max-w-5xl mx-auto pb-16 md-container"
                    contentEditable
                    id="editor"
                    suppressContentEditableWarning // yup
                    ref={container}
                    onInput={(e) => {
                        console.log(parseInnerText(e.currentTarget));
                        // onChange(includeMd ? e.currentTarget.innerText : unparse(e.currentTarget.innerHTML));
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
        </>
    )
}