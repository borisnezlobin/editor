import { Menu, MenuItemConstructorOptions } from 'electron';
import { openFileOpenDialog } from './ipc-controller';

const template: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                role: 'quit',
                label: '&Quit'
            },
            {
                role: "close",
                label: "&Close Window"
            }
        ]
    }, {
        label: 'File',
        submenu: [
        {
            label: 'New File',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
                // TODO
            }
        }, {
            label: 'Open File from Disk',
            accelerator: 'CmdOrCtrl+O',
            click: openFileOpenDialog
        }, {
            type: 'separator'
        }
        ]
    }, {
        label: 'Edit',
        submenu: [
            {
                role: 'undo',
                label: '&Undo'
            }, {
                role: 'redo',
                label: '&Redo'
            }, {
                type: 'separator'
            }, {
                role: 'cut',
                label: 'Cu&t'
            }, {
                role: 'copy',
                label: '&Copy'
            }, {
                role: 'paste',
                label: '&Paste'
            },
        ]
    }, {
        label: "Help",
        submenu: [
            {
                role: 'about',
                label: '&About'
            }, {
                label: 'Learn About &Markdown',
            }
        ]
    }
];

const mainMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(mainMenu);

export { mainMenu };