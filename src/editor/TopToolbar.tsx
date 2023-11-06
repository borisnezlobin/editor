import { useContext, useState } from "react";
import { TextButton } from "../utils/text-button";
import { EditorContext, TypingContext } from "../context";
import { ArrowLeft, Article, Barcode, BookOpenText, CaretDown, Notches, TextAa } from "@phosphor-icons/react";
import { Muted } from "../typography/muted";
import { Separator } from "../utils/separator";


const editorTypes = [
    {
        name: "Text",
        icon: <TextAa className="w-6 h-6" weight="light" />
    },
    {
        name: "Markdown",
        icon: <Article className="w-6 h-6" weight="light" />
    },
    {
        name: "Mixed",
        icon: <Barcode className="w-6 h-6" weight="light" />
    },
    {
        name: "Split",
        icon: <BookOpenText className="w-6 h-6" weight="light" />
    }
];

export const TopToolbar: React.FC = () => {
    const { typing, focusAllowed, setFocusAllowed, setTyping} = useContext(TypingContext);
    const { editorType, setEditorType, setOpenFile, fileContent, updateFileContent  } = useContext(EditorContext);

    type CountType = "chars" | "words" | "sentences" | "lines";
    const [countType, setCountType] = useState<CountType>("words");

    let editorTypeIcon = 0;
    if(editorType == "markdown") editorTypeIcon = 1;
    else if(editorType == "split") editorTypeIcon = 2;

    const saveAndClose = () => {
        updateFileContent(fileContent);
        setTyping(false);
        setOpenFile(null);
    }

    const counts = {
        "chars": fileContent.length,
        "words": fileContent.split(/\s+/).filter((s: string) => s.trim() != "").length,
        "sentences": 1 + (fileContent?.match(/[\w|\)][.?!](\s|$)/g)?.length || 0),
        "lines": fileContent.split("\n").filter((s: string) => s.trim() != "").length,
    }

    return (
        <div className={`w-full h-10 border-b z-10 border-gray-100 py-2 px-2 fixed top-10 flex flex-row justify-between items-center bg-white transition ${typing ? "pointer-events-none opacity-0" : "opacity-100"}`}>
            <div className={`flex flex-row justify-start items-center`}>
                <TextButton onClick={saveAndClose}>
                    <ArrowLeft className="w-6 h-6 cursor-pointer" weight="light" />
                    <p>Exit</p>
                </TextButton>
                <div className="focus-dropdown min-w-96">
                    <TextButton onClick={() => {}} className="w-64">
                        {editorTypes[editorTypeIcon].icon}
                        {editorTypes[editorTypeIcon].name} View
                    </TextButton>
                    <div className="dropdown-content font-normal text-xs bg-white/50 border border-gray-200 backdrop-blur">
                        {editorTypes.map((type, index) => (
                            // @ts-ignore
                            <TextButton key={index} onClick={() => setEditorType(type.name.toLowerCase())} className={`text-gray-600 font-normal w-full items-start justify-start border ${type.name.toLowerCase() == editorType ? "border-gray-300" : " border-gray-50/0"}`}>
                                {type.icon}
                                <p>{type.name} View</p>
                            </TextButton>
                        ))}
                        <hr className="my-2" />
                        <Muted>Select which view to display.</Muted>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-end items-center gap-2">
            <div className=" justify-center cursor-default focus-dropdown">
                    <TextButton onClick={() => {
                        setFocusAllowed(!focusAllowed);
                    }} className={`w-full border border-gray-300 ${focusAllowed ? "" : "bg-gray-300"}`}>
                        <Notches className="w-4 h-4 text-gray-600" weight="light" />
                    </TextButton>
                    <div className="dropdown-content font-normal text-xs bg-white/50 border border-gray-200 backdrop-blur">
                        <p className="text-lg">
                            Currently {focusAllowed ? "enabled" : "disabled"}.
                        </p>
                        <Separator vertical={true} />
                        <Muted>
                            Focused Typing hides distractions when you start typing. Click to toggle.
                        </Muted>
                    </div>
                </div>
                <div className="w-64 justify-center cursor-default focus-dropdown">
                    <TextButton onClick={() => {}} className="w-full border border-gray-300">
                        <CaretDown className="w-4 h-4 text-gray-600" weight="light" />
                        <Muted className="flex-1">
                            {counts[countType]} {counts[countType] == 1 ? countType.substring(0, countType.length - 1) : countType}
                        </Muted>
                    </TextButton>
                    <div className="dropdown-content font-normal text-xs bg-white/50 border border-gray-200 backdrop-blur">
                        <TextButton onClick={() => setCountType("chars")} className="text-gray-600 font-normal w-full">
                            {counts.chars} character{counts.chars == 1 ? "" : "s"}
                        </TextButton>
                        <TextButton onClick={() => setCountType("words")} className="text-gray-600 font-normal w-full">
                            {counts.words} word{counts.words == 1 ? "" : "s"}
                        </TextButton>
                        <TextButton onClick={() => setCountType("sentences")} className="text-gray-600 font-normal w-full">
                            {counts.sentences || 0} sentence{counts.sentences == 1 ? "" : "s"}
                        </TextButton>
                        <TextButton onClick={() => setCountType("lines")} className="text-gray-600 font-normal w-full">
                            {counts.lines} line{counts.lines == 1 ? "" : "s"}
                        </TextButton>
                        <hr className="my-2" />
                        <Muted>Select which count to display. Counts may be inaccurate.</Muted>
                    </div>
                </div>
            </div>
        </div>
    );
};