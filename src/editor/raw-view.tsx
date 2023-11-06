import { useContext, useEffect, useState } from "react";
import { CONFIG } from "../utils/config";
import { EditViewProps } from "./EditViewProps";
import { TextArea } from "./TextArea";
import { TypingContext } from "../context";

export const RawView: React.FC<EditViewProps> = ({ value, onChange }) => {
    const [lastKeyStroke, setLastKeyStroke] = useState(Date.now() - CONFIG.TYPING_TIMEOUT - 1);
    const { typing, setTyping, focusAllowed } = useContext(TypingContext);

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
    }, [value, lastKeyStroke, focusAllowed]);

    return (
        <TextArea
            content={value}
            setContent={(content: string) => {
                setLastKeyStroke(Date.now());
                onChange(content);
            }}
        />
    );
}