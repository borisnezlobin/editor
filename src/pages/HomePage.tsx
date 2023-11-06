import { ArrowSquareOut, Clock, Dot, File as FileIcon, FileX, GithubLogo, Info, Plus, TextT } from "@phosphor-icons/react";
import React, { useContext, useEffect } from "react";
import { EditorContext } from "../context";
import { RandomTextBackground } from "../typography/random-text-background";
import { Separator } from "../utils/separator";
import { CONFIG } from "../utils/config";
import { Muted } from "../typography/muted";
import { TextButton } from "../utils/text-button";
import { errorToast, successToast } from "../utils/toast";

export const HomePage: React.FC = () => {
    const { setOpenFile, setFile } = useContext(EditorContext);
    const [contentType, setContentType] = React.useState<"home" | "create-file">("home");
    const [error, setError] = React.useState<string | null>(null);
    const [textValue, setTextValue] = React.useState<string>("");
    const recentsJson = localStorage.getItem("recents");
    const recents = recentsJson ? JSON.parse(recentsJson) : [];
    const fileOpenRef = React.useRef<HTMLInputElement>(null);

    const openFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;
        const file = e.target.files[0];
        if(!file) return;

        // update "recents" localStorage
        const newRecents = [];
        if(recents[1]) newRecents.push(recents[1]);

        if(recents[0]) newRecents.push(recents[0]);

        newRecents.push({
            name: file.name,
            path: (file as any).path
        });

        localStorage.setItem("recents", JSON.stringify(newRecents));

        setOpenFile(file);
    }

    async function openFileWithName(name: string, path: string){
        const res = await setFile(name, path);
        if(!res){
            errorToast("File moved or missing.");
        }
    }

    useEffect(() => {
        if(!fileOpenRef.current){
            // @ts-ignore
            window.api.on("open-file-open-dialog", () => {
                if(fileOpenRef.current) fileOpenRef.current.click();
                else console.error("fileOpenRef.current is null");
            });
        }
    }, [fileOpenRef]);

    const homeContent = (
        <>
            <p className="text-4xl">Placeholder Name</p>
            <div className="w-4/5 h-px bg-gray-500" />
            <div className="w-full flex flex-col gap-3">
                <div className="flex flex-row text-base gap-2 justify-start items-center">
                    <Plus className="w-6 h-6" weight="light" />
                    <p onClick={() => setContentType("create-file")} className="hover:underline cursor-pointer">Create a new file</p>
                </div>
                <Separator vertical={true} size="large" />
                <label htmlFor="fileInput" className="flex flex-row gap-2 text-base justify-start items-center">
                    <FileIcon className="w-6 h-6" weight="light" />
                    <p className="hover:underline cursor-pointer">Open an existing file</p>
                    <input ref={fileOpenRef} id="fileInput" type="file" accept=".md" onChange={openFile} className="hidden" />
                </label>
                <div className="flex flex-row text-base gap-2 justify-start items-center">
                    {recents.length == 0 ?
                        <>
                            <FileX className="w-6 h-6" weight="light" />
                            <p>No recent files</p>
                        </>
                    :
                    <>
                        <Clock className="w-6 h-6" weight="light" />
                        <p>Open recents: </p>
                        {recents.map((e: { name: string, path: string }, i: number) => {
                            return <Muted className="flex flex-row">
                                <p className="hover:underline cursor-pointer" onClick={async () => {
                                    openFileWithName(e.name, e.path)
                                }}>{e.name}</p>
                                {i < recents.length - 1 ? <Dot className="w-6 h-6" /> : <></>}
                            </Muted>
                        })}
                    </>
                    }
                </div>

                <Separator vertical={true} size="large" />

                <div onClick={() => window.open("https://www.markdownguide.org/basic-syntax/")} className="flex flex-row text-base gap-2 justify-start items-center">
                    <ArrowSquareOut className="w-6 h-6" weight="light" />
                    <p className="hover:underline cursor-pointer">Learn about Markdown</p>
                </div>
                <div onClick={() => window.open(CONFIG.GIT_REPO)} className="flex flex-row text-base gap-2 justify-start items-center">
                    <GithubLogo className="w-6 h-6" weight="light" />
                    <p className="hover:underline cursor-pointer">Check out this project on GitHub</p>
                </div>
            </div>
        </>
    );

    const createFileContent = (
        <>
            <h1 className="text-4xl">Create a new file</h1>
            <input
                className={`w-2/3 h-8 px-4 rounded-lg border  focus:outline-none ${error ? "border-red-900 bg-red-50" : "border-gray-300 focus:border-gray-400 bg-gray-100"}`}
                placeholder="File name"
                value={textValue}
                onChange={(e) => {
                    setTextValue(e.target.value);

                    // validate text value
                    if(e.target.value.trim() == "") setError("File name cannot be empty");
                    else if(e.target.value.includes("/")) setError("File name cannot contain '/'");
                    else if(e.target.value.includes("\\")) setError("File name cannot contain '\\'");
                    else if(e.target.value.includes(".")) setError("File name cannot contain '.'");
                    else setError(null);
                }}
            />
            <p className="text-sm text-red-900 ml-1 mt-0">
                {error ? error : <br />}
            </p>
            <div className="flex flex-row justify-end items-center gap-2">
                <TextButton onClick={() => {
                    setContentType("home");
                    setError(null);
                    setTextValue("");
                }} className="font-normal border border-gray-400">
                    Cancel
                </TextButton>
                <TextButton onClick={async () => {
                    if(error) return;
                    // @ts-ignore
                    const path = await window.api.createFileWithName(textValue + ".md");
                    console.log(path);
                    setFile(textValue + ".md", path);
                }} className="border border-gray-400">
                    Create
                </TextButton>
            </div>
        </>
    );

    const logo = (
        <div className="flex flex-row justify-start items-center gap-2">
            <TextT className="w-48 h-48" weight="light" />
            <p className="text-2xl">Placeholder Name</p>
        </div>
    )

    return (
        <>
            <RandomTextBackground />
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="pl-8 w-full md:w-full transition h-full md:h-full flex flex-col justify-center items-start rounded-lg shadow-xl border border-gray-300 bg-white/50 backdrop-blur relative gap-4">
                    {contentType == "home" ? homeContent : contentType == "create-file" ? createFileContent : <></>}
                </div>
            </div>
        </>
    );
}