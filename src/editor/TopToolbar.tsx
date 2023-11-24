import { useContext, useRef, useState } from "react";
import { TextButton } from "../utils/text-button";
import { EditorContext, TypingContext } from "../context";
import { ArrowLeft, ArrowSquareOut, Article, Barcode, BookOpenText, CaretDown, Check, CheckFat, GithubLogo, Notches, TextAa, Warning, X, XSquare } from "@phosphor-icons/react";
import { Muted } from "../typography/muted";
import { Separator } from "../utils/separator";
import { Modal } from "../utils/modal";
import { DynamicHeader } from "../typography/dynamic/dheader";
import WarningIllustration from "../illustrations/warning-illustration";
import { ThumbsUp } from "@phosphor-icons/react/dist/ssr";


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
    const showWarning = JSON.parse(localStorage.getItem("showWarning") || "true");
    const checkboxRef = useRef<HTMLInputElement>(null);
    const [warningModalOpen, setWarningModalOpen] = useState(false);

    type CountType = "chars" | "words" | "sentences" | "lines";
    const [countType, setCountType] = useState<CountType>("words");

    let editorTypeIcon = 0;
    if(editorType == "markdown") editorTypeIcon = 1;
    else if(editorType == "mixed") editorTypeIcon = 2;
    else if(editorType == "split") editorTypeIcon = 3;

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
        <>
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
                                <TextButton
                                    key={index}
                                    onClick={() => {
                                        if(type.name == "Mixed" && showWarning){
                                            setWarningModalOpen(true);
                                            return;
                                        }
                                        // @ts-ignore
                                        setEditorType(type.name.toLowerCase())
                                    }}
                                    className={`text-gray-600 font-normal w-full items-start justify-start border ${type.name.toLowerCase() == editorType ? "border-gray-300" : " border-gray-50/0"}`}
                                >
                                    {type.icon}
                                    <p>{type.name} View</p>
                                    {type.name.toLowerCase() == editorType && <Check className="w-4 h-4 ml-auto" weight="light" />}
                                    {editorType != "mixed" && type.name == "Mixed" && <Warning className="w-4 h-4 ml-auto text-red-700" weight="fill" />}
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
            <Modal open={warningModalOpen} modalClassName="p-8 h-[25rem]" className="z-[101]">
                <DynamicHeader depth={2} includeMD={true} text="Mixed View is a work in progress" props={{}}/>
                <p>
                    Mixed View may not work as expected, and may <em>*irreversibly*</em> harm your file.<br />
                    There are  many known issues -- it is best to avoid using lists, tables, and quotes.
                </p>
                <div className="w-full h-36 flex flex-col justify-center items-end ">
                    <TextButton className="text-red-700 bg-gray-50 border border-gray-200 hover:border-red-900" onClick={() => {
                        setWarningModalOpen(false);
                        if(checkboxRef.current?.checked) localStorage.setItem("showWarning", "false");
                        // @ts-ignore
                        setEditorType("mixed");
                    }}>
                        I understand the risks of Mixed View
                    </TextButton>
                </div>
                <div className="w-full flex justify-center items-center mt-6">
                    <TextButton onClick={() => window.open("https://github.com/borisnezlobin/editor/issues/22", "_blank")} className="text-xs mr-4">
                        <ArrowSquareOut className="w-5 h-5" weight="light" />
                        Mixed View on GitHub
                    </TextButton>
                    <TextButton onClick={() => setWarningModalOpen(false)} className="bg-gray-50 border border-gray-200 hover:border-gray-400 px-8 py-6">
                        Go back (recommended)
                    </TextButton>
                </div>
                <label className="flex flex-row justify-center items-center gap-2 mt-1 cursor-pointer">
                    <input type="checkbox" className="form-checkbox" ref={checkboxRef} />
                    <Muted>Don't show this again</Muted>
                </label>
                <WarningIllustration className={`relative h-64 w-64 pointer-events-none bottom-[15.5rem]`} />
            </Modal>
        </>
    );
};