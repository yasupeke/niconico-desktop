import * as React from 'react';
import { TextField, RaisedButton  } from 'material-ui';
import { FontIcon } from 'material-ui/FontIcon';

export interface IProps extends React.Props<{}> {
    status: NicoNicoDesktop.RoomStatus;
    websocketServerHost: string;
    onChangeHost(websocketServerHost: string): void;
}


interface IState {
    websocketServerHost?: string;
    disabled?: boolean;
}

const wrapperStyles = {
    textAlign: 'center'
}

const textStyles = {
    marginRight: '8px'
};

export default class InputComment extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            websocketServerHost: props.websocketServerHost || '',
            disabled: this.props.status === NicoNicoDesktop.RoomStatus.Login
        };
    }

    private handleUpdate(): void {
        const text = this.refs['host'] as TextField;
        const websocketServerHost = text.getValue();
        this.setState({ websocketServerHost });
    }

    private handleTap(): void {
        this.props.onChangeHost(this.state.websocketServerHost);
    }

    public render(): React.ReactElement<void> {
        let inputDisabled = true;
        if(this.props.status === NicoNicoDesktop.RoomStatus.Logout) {
            inputDisabled = false;
        }
        return (
            <div style={wrapperStyles}>
                <TextField
                    ref="host"
                    floatingLabelText="Websocket Server Host"
                    value={this.state.websocketServerHost}
                    disabled={inputDisabled}
                    onChange={this.handleUpdate.bind(this)}
                    style={textStyles}
                />
                <RaisedButton 
                    label={'CHANGE'}
                    onTouchTap={this.handleTap.bind(this)}
                    disabled={inputDisabled}
                />
            </div>
        );
    }
}