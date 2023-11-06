import { HTMLProps } from "react";
import ChildrenProps from "../utils/children-props";

export const Muted: React.FC<HTMLProps<HTMLSpanElement> & ChildrenProps> = ({ children, className }) => {
    return (
        <span className={"text-gray-600 font-normal " + className}>{children}</span>
    );
};