import { ipcRenderer } from 'electron';
import * as SocketIO from 'socket.io-client';
import { getUrlParam } from '../util/url';
import { ReceiverAction } from '../constants/events';

const host = decodeURIComponent(getUrlParam('host'));
const roomId = getUrlParam('roomid');
const socket = SocketIO(host);
const body = <HTMLBodyElement>document.querySelector('body');
const width = body.clientWidth;
const height = body.clientHeight;
const canvas = <HTMLCanvasElement>document.querySelector('canvas');
canvas.setAttribute('width', width + '');
canvas.setAttribute('height', height + '');
const stage = new createjs.Stage(canvas);

function writeText(comment: NicoNicoDesktop.IComment): void {
    const text = new createjs.Text(comment.comment, `bold ${comment.size}px Arial`, comment.color);
    const tw = text.getMeasuredWidth();
    const th = text.getMeasuredHeight();
    text.x = width;
    text.y = Math.floor(Math.random() * (height - th));
    text.shadow = new createjs.Shadow(comment.shadowColor || '#ffffff', 4, 4, 8);
    createjs.Tween.get(text)
        .to({x: -tw}, comment.speed, createjs.Ease.linear)
        .call(() => {
            stage.removeChild(text);
        });
    stage.addChild(text);
}

ipcRenderer.on(ReceiverAction.CHANGE_ALPHA, (event: Electron.IpcRendererEvent, alpha: number) => {
    stage.alpha = alpha;
});

ipcRenderer.on(ReceiverAction.CLOSE, (event: Electron.IpcRendererEvent, alpha: number) => {
    socket.close();
    ipcRenderer.send(ReceiverAction.CLOSE_END);
});

socket.on('connect', () => {
    socket.emit('join', roomId);
});

socket.on('join', (roomId: string) => {
    writeText({
        roomId: null,
        comment: `Room ID: ${roomId}`,
        color: '#000000',
        shadowColor: '#ffffff',
        size: 80,
        speed: 10000
    });
    ipcRenderer.send(ReceiverAction.JOIN_SUCCESS);
});

socket.on('flowing', (comment: NicoNicoDesktop.IComment) => {
    writeText(comment)
});

createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
createjs.Ticker.addEventListener('tick', stage);
