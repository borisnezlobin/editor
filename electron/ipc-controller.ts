import { dialog, ipcMain } from "electron";
import { readFile, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function setupIpcController(){
    ipcMain.handle("update-file-content", (event, arg) => {
        try{
          writeFileSync(arg.file, arg.content);
        }catch (e){ } // yeah so uh
        // TODO
    });

    ipcMain.handle("read-file-with-path", (event, arg) => {
        try{
            const str = readFileSync(arg, "utf8");
            return str;
        }catch (e){
            return false;
        }
    });

    ipcMain.handle("create-file-with-name", (event, arg) => {
        try{
            const dir = join(__dirname, arg);
            writeFileSync(dir, "");
            return dir;
        }catch (e){
            return false;
        }
    });
};

function openFileOpenDialog(){
    // ipcMain.emit("open-file-open-dialog");
    dialog.showOpenDialog({
        properties: ["openFile"],
        // only markdown files
        filters: [
            { name: "Markdown", extensions: ["md"] }
        ]
    }).then(result => {
        if(!result.canceled){
            ipcMain.emit("file-opened", result.filePaths[0]);
            // read file contents
            readFile(result.filePaths[0], (content) => {
                ipcMain.emit("file-contents", content);
            });
            // send file contents to renderer
        }
    });
}

export { setupIpcController, openFileOpenDialog };