import ChildrenProps from "../utils/children-props";

export const Code: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <code className="code">
            {children}
        </code>
    );
}