import { HTMLProps } from "react";
import ChildrenProps from "../utils/children-props";

export const Muted: React.FC<HTMLProps<HTMLSpanElement> & ChildrenProps> = (props) => {
    return (
        <span {...props} className={"text-gray-600 font-normal " + props.className}>{props.children}</span>
    );
};