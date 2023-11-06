import { marked } from "marked";
import "../styles/markdown.css"
import { mdparse } from "./md-parse";

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
        </div>
    );
};