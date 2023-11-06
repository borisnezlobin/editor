import ChildrenProps from "../utils/children-props";

export const Bold: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <b className="font-bold">{children}</b>
    );
}