import { ButtonProps } from "./button";

export const TextButton: React.FC<ButtonProps> = ({ children, className, onClick }) => {
    return (
        <button onClick={onClick} className={"px-4 h-8 gap-2 font-bold text-sm flex flex-row items-center cursor-pointer rounded hover:bg-black/10 " + className}>
            {children}
        </button>
    );
};