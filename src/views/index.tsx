import { ipcRenderer } from 'electron';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { MainAction } from '../constants/events';
import { getUrlParam } from '../util/url';
import Main from './containers/main';

const host = decodeURIComponent(getUrlParam('host'));

function onJoin(roomId: string): void {
    ipcRenderer.send(MainAction.OPEN, roomId);
}

function onLeave(): void {
    ipcRenderer.send(MainAction.CLOSE);
}

function onChangeHost(websocketServerHost: string): void {
    ipcRenderer.send(MainAction.CHANGE_HOST, websocketServerHost);
}

function onChangeAlpha(alpha: number): void {
    ipcRenderer.send(MainAction.CHANGE_ALPHA, alpha)
}

function render(status: NicoNicoDesktop.RoomStatus): void {
    ReactDom.render(
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Main
                websocketServerHost={host}
                status={status}
                onJoin={onJoin}
                onLeave={onLeave}
                onChangeAlpha={onChangeAlpha}
                onChangeHost={onChangeHost}
            />
        </MuiThemeProvider>,
        document.querySelector('#join')
    );
}

ipcRenderer.on(MainAction.OPEN_SUCCESS, () => {
    render(NicoNicoDesktop.RoomStatus.Login);
});

ipcRenderer.on(MainAction.CLOSE_SUCCESS, () => {
    render(NicoNicoDesktop.RoomStatus.Logout);
});

ipcRenderer.on(MainAction.CHANGE_HOST_SUCCESS, () => {
    alert('Success');
});

injectTapEventPlugin();

render(NicoNicoDesktop.RoomStatus.Logout);
