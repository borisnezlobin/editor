import { HTMLProps } from "react";
import { RawView } from "./raw-view";
import { TextView } from "./text-view";
import { EditViewProps } from "./EditViewProps";

const SplitView: React.FC<EditViewProps> = ({ value, onChange }) => {
    return (
        <div className="w-full h-full flex flex-row justify-between items-start">
            <RawView value={value} onChange={onChange} />
            <div className="w-px h-full bg-gray-200" />
            <TextView value={value} onChange={onChange} />
        </div>
    );
}

export default SplitView;