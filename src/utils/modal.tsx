import { HTMLProps } from "react";

interface ModalProps extends HTMLProps<HTMLDivElement> {
    className?: string;
    children: React.ReactNode | null;
    modalClassName?: string;
    open: boolean;
}

export const Modal: React.FC<ModalProps> = ({ children, open, ...props }) => {
    return (
        <div {...props} className={`fixed w-full h-full top-0 left-0 flex justify-center transtion duration-300 items-center bg-black/50 z-[100] ${!open ? "opacity-0 pointer-events-none" : ""} ${props.className}`}>
            <div className={`bg-white rounded-lg min-w-1/2 shadow-2xl p-4 transition duration-300 ${open ? "" : "translate-y-24"} ${props.modalClassName}`}>
                {children}
            </div>
        </div>
    );
}