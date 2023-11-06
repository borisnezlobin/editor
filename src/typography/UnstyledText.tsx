import { HTMLProps } from "react";
import ChildrenProps from "../utils/children-props";

const UnstyledText: React.FC<HTMLProps<HTMLSpanElement> & ChildrenProps> = (props) => {
    return (
        <span
            // style={{
            //     all: "initial",
            //     boxSizing: "border-box",
            //     margin: 0,
            //     padding: 0,
            //     fontFamily: "'Open Sans', sans-serif",
            // }}
            {...props}
            className={"revert " + props.className}
        >
            {props.children}
        </span>
    )
}

export { UnstyledText };