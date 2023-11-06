import React, { useContext } from "react";
import { EditorContext, EditorProvider } from "../context";
import { Editor } from "../editor/Editor";
import { HomePage } from "../pages/HomePage";

export const Layout: React.FC = () => {
    const { file } = useContext(EditorContext);

    if(file != "") return (
        <Editor />
    );
    
    return <HomePage />;
}