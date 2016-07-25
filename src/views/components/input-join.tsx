import * as React from 'react';
import { TextField, RaisedButton  } from 'material-ui';
import { FontIcon } from 'material-ui/FontIcon';

export interface IProps extends React.Props<{}> {
    status: NicoNicoDesktop.RoomStatus;
    onJoin(roomId: string): void;
    onLeave(): void;
}


interface IState {
    roomId?: string;
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
            roomId: ''
        };
    }

    private handleUpdate(): void {
        const text = this.refs['roomId'] as TextField;
        const roomId = text.getValue();
        this.setState({ roomId });
    }

    private handleTap(): void {
        if(this.props.status === NicoNicoDesktop.RoomStatus.Login) {
            this.props.onLeave();
        }else {
            if(this.state.roomId.length === 0) {
                return;
            }
            this.props.onJoin(this.state.roomId);
        }
    }

    public render(): React.ReactElement<void> {
        let btnLabel = 'Leave';
        let inputDisabled = true;
        if(this.props.status === NicoNicoDesktop.RoomStatus.Logout) {
            btnLabel = 'Join';
            inputDisabled = false;
        }
        return (
            <div style={wrapperStyles}>
                <TextField
                    ref="roomId"
                    floatingLabelText="Room ID"
                    value={this.state.roomId}
                    disabled={inputDisabled}
                    onChange={this.handleUpdate.bind(this)}
                    style={textStyles}
                />
                <RaisedButton 
                    label={btnLabel}
                    onTouchTap={this.handleTap.bind(this)}
                />
            </div>
        );
    }
}