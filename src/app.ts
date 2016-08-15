import * as Electron from 'electron';
import { ipcMain } from 'electron'; 
import { MainAction, ReceiverAction } from './constants/events';
import * as Storage from 'electron-json-storage';

const app = Electron.app;
const BrowserWindow = Electron.BrowserWindow;
let mainWindow: Electron.BrowserWindow;
let receiverWindow: Electron.BrowserWindow;
let randerWindow: Electron.BrowserWindow;

function getConfig(): Promise<NicoNicoDesktop.IConfig> {
    return new Promise<NicoNicoDesktop.IConfig>((resolve: (config: NicoNicoDesktop.IConfig) => void, reject: (error: any) => void) => {
        Storage.get('config', (error: any, config: NicoNicoDesktop.IConfig) => {
            if (error) {
                reject(error);
            }
            if (Object.keys(config).length === 0) {
                config.websocketServerHost = 'http://172.24.212.86:3000/';
            }
            resolve(config);
        });
    });
}

function setConfig(config: NicoNicoDesktop.IConfig): Promise<NicoNicoDesktop.IConfig> {
    return new Promise<NicoNicoDesktop.IConfig>((resolve: (config: NicoNicoDesktop.IConfig) => void, reject: (error: any) => void) => {
        Storage.set('config', config, (error: any) => {
            if (error) {
                reject(error);
            }
            resolve(config);
        });
    });
}

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
    getConfig()
        .then((config: NicoNicoDesktop.IConfig) => {
            receiverWindow.loadURL(`file://${__dirname}/views/receive.html?roomid=${roomId}&host=${encodeURIComponent(config.websocketServerHost)}`);
        })
        .catch(() => {
            mainWindow.webContents.send(MainAction.OPEN_ERROR);
        });
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

ipcMain.on(MainAction.CHANGE_HOST, (event: Electron.IpcMainEvent, host: string) => {
    getConfig()
        .then((config: NicoNicoDesktop.IConfig) => {
            config.websocketServerHost = host;
            return setConfig(config);
        })
        .then((config: NicoNicoDesktop.IConfig) => {
            mainWindow.webContents.send(MainAction.CHANGE_HOST_SUCCESS);
        })
        .catch(() => {
            mainWindow.webContents.send(MainAction.CHANGE_HOST_ERROR);
        });
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

    getConfig().then((config: NicoNicoDesktop.IConfig) => {
        mainWindow.loadURL(`file://${__dirname}/views/index.html?host=${encodeURIComponent(config.websocketServerHost)}`);
    });
});