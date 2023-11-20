import { HTMLProps, ReactPropTypes } from "react";
import { deEscape } from "../../editor/md-parse";

export const headerSizes = [
    "text-4xl pb-2 border-b border-gray-300",
    "text-3xl pb-2 border-b border-gray-200",
    "text-2xl pb-1 border-b border-gray-100",
    "text-xl",
    "text-lg",
    "text-base"
];

interface DynamicHeaderProps {
    depth: number;
    text: string;
    includeMD: boolean;
    props: HTMLProps<HTMLHeadingElement>;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({ props, depth, text, includeMD }) => {
    if(depth == 1){
        return (
            <>
                <h1 {...props} className={`${headerSizes[depth]} font-bold mb-4`}>
                    {includeMD ? "# " : ""}{deEscape(text)}
                </h1>
                {/* <aside><hr className="mb-4" contentEditable={false} /></aside> */}
            </>
        );
    }else if (depth == 2){
        return (
            <>
                <h2 {...props} className={`${headerSizes[depth]} font-bold mb-4`}>
                    {includeMD ? "## " : ""}{deEscape(text)}
                </h2>
                {/* <aside><hr className="mb-4" contentEditable={false} /></aside> */}
            </>
        );
    } else if (depth == 3){
        return (
            <h3 {...props} className={`${headerSizes[depth]} font-bold mb-4`}>
                {includeMD ? "### " : ""}{deEscape(text)}
            </h3>
        );
    }else if(depth == 4){
        return (
            <h4 {...props} className={`${headerSizes[depth]} font-bold mb-4`}>
                {includeMD ? "#### " : ""}{deEscape(text)}
            </h4>
        );
    } else if(depth == 5){
        return (
            <h5 {...props} className={`${headerSizes[depth]} font-bold mb-4`}>
                {includeMD ? "##### " : ""}{deEscape(text)}
            </h5>
        );
    }else{
        return (
            <h6 {...props} className={`${headerSizes[depth]} font-bold mb-4`}>
                {includeMD ? "###### " : ""}{deEscape(text)}
            </h6>
        );
    }
};