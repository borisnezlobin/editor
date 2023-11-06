import React, { useContext } from 'react';
import { EditorContext } from '../context';
import { Toolbar } from './Toolbar';
import { TopToolbar } from './TopToolbar';
import { RawView } from './raw-view';
import { TextView } from './text-view';
import SplitView from './split-view';

export const Editor: React.FC = () => {
    const { editorType, fileContent, updateFileContent } = useContext(EditorContext);

    function updateContent(content: string) {
        updateFileContent(content);
    }

    function renderEditor() {
        switch (editorType) {
            case 'split':
                return <SplitView value={fileContent} onChange={updateContent} />;
            case 'text':
                return <RawView value={fileContent} onChange={updateContent} />;
            case 'markdown':
                return <TextView value={fileContent} includeMd={false} onChange={updateContent} />;
            case 'mixed':
                return <TextView value={fileContent} includeMd={true} onChange={updateContent} />;
            default:
                return <></>;
        }
    }

    return (
        <div className={`w-full h-screen`}>
            <TopToolbar />
            <div className='w-full h-full relative top-20'>
                {renderEditor()}
            </div>
        </div>
    );
}