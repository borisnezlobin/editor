import ChildrenProps from "../utils/children-props";

export const H1: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <h1 className="text-4xl font-bold mb-4">{children}</h1>
    );
}

export const H2: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <h2 className="text-3xl font-bold mb-4">{children}</h2>
    );
}

export const H3: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <h3 className="text-2xl font-bold mb-4">{children}</h3>
    );
}

export const H4: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <h4 className="text-xl font-bold mb-4">{children}</h4>
    );
}

export const H5: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <h5 className="text-lg font-bold mb-4">{children}</h5>
    );
}

export const H6: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <h6 className="text-base font-bold mb-4">{children}</h6>
    );
}