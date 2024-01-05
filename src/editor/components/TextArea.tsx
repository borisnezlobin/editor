import { marked } from "marked";
import "../../styles/markdown.css"
import { mdparse } from "../md-parse";
import placeholderWords from "../empty-editor-phrases.json";
import { TextTypingEffect } from "../../typography/dynamic/text-typing-effect";

interface TextAreaProps {
    content: string;
    setContent: (content: string) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ content, setContent }) => {
    return (
        <div className="w-full h-full flex justif-start items-center">
            <textarea
                className="bg-transparent resize-none text-lg px-4 outline-none h-full w-full max-w-5xl mx-auto pb-24"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            {!content.length &&(
                <div className="fixed w-full select-none top-20">
                    <div className="max-w-5xl mx-auto px-4">
                        <TextTypingEffect texts={placeholderWords} className="text-gray-400 text-left italic text-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};