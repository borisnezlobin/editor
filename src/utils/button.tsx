export interface ButtonProps {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
    return (
        <button
            className={`hover:bg-black/10 text-black font-bold py-2 px-4 rounded ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}