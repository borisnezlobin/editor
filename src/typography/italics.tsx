import ChildrenProps from "../utils/children-props";

export const Italics: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <i className="italic">{children}</i>
    );
}