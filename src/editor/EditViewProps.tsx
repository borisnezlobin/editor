export interface EditViewProps {
    value: string;
    includeMd?: boolean;
    onChange: (value: string) => void;
    scroll?: number;
}