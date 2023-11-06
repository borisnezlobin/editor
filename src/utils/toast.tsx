import toast from "react-hot-toast";

export function successToast(message: string) {
    toast.success(message, {
        style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
        },
    });
}

export function errorToast(message: string) {
    toast.error(message, {
        style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
        },
    });
}