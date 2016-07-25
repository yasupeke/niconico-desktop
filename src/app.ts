import * as Electron from 'electron';
import { ipcMain } from 'electron'; 
import { MainAction, ReceiverAction } from './constants/events';

const app = Electron.app;
const BrowserWindow = Electron.BrowserWindow;
let mainWindow: Electron.BrowserWindow;
let receiverWindow: Electron.BrowserWindow;
let randerWindow: Electron.BrowserWindow;

ipcMain.on(MainAction.OPEN, (event: Electron.IpcMainEvent, roomId: string) => {
    if(receiverWindow) return;
    const size = Electron.screen.getPrimaryDisplay().size;
    receiverWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        frame: false,
        show: true,
        fullscreen : true,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true
    });
    receiverWindow.on('closed', function() {
        receiverWindow = null;
    });
    receiverWindow.setIgnoreMouseEvents(true);
    receiverWindow.maximize();
    receiverWindow.setAlwaysOnTop(true);
    receiverWindow.loadURL(`file://${__dirname}/views/receive.html?roomid=${roomId}`);
});

ipcMain.on(MainAction.CLOSE, (event: Electron.IpcMainEvent) => {
    receiverWindow.close();
    mainWindow.webContents.send(MainAction.CLOSE_SUCCESS);
});

ipcMain.on(MainAction.CHANGE_ALPHA, (event: Electron.IpcMainEvent, alpha: number) => {
    if(receiverWindow) {
        receiverWindow.webContents.send(ReceiverAction.CHANGE_ALPHA, alpha);
    }
});

ipcMain.on(ReceiverAction.JOIN_SUCCESS, (event: Electron.IpcMainEvent) => {
    mainWindow.webContents.send(MainAction.OPEN_SUCCESS);
});

ipcMain.on(ReceiverAction.CLOSE_END, (event: Electron.IpcMainEvent) => {
    mainWindow.webContents.send(MainAction.CLOSE_SUCCESS);
});

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 460,
        height: 460,
        frame: true,
        show: true,
        resizable: true
    });

    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function() {
        mainWindow = null;
        if(receiverWindow) {
            receiverWindow.close();
        }
        receiverWindow = null;
    });

    mainWindow.loadURL(`file://${__dirname}/views/index.html`);
});