import { useEffect, useState } from "react";

interface TextTypingEffectProps {
    texts: string[];
    className?: string;
}

const TextTypingEffect: React.FC<TextTypingEffectProps> = ({ texts = ["Hello world"], ...props }) => {
    const [text, setText] = useState("");
    const [sentenceIndex, setSentenceIndex] = useState(0);

    useEffect(() => {
        if(text.length == texts[sentenceIndex].length) {
            setTimeout(() => {
                if(sentenceIndex == texts.length - 1) setSentenceIndex(0);
                else setSentenceIndex(sentenceIndex + 1);
                setText("");
            }, 1000);
        } else {
            setTimeout(() => {
                setText(texts[sentenceIndex].slice(0, text.length + 1));
            }, 50);
        }
    }, [text, sentenceIndex]);

    return (
        <span {...props}>
            {text}
        </span>
    );
}

export { TextTypingEffect };