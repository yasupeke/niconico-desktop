import * as React from 'react';
import InputJoin, { IProps as InputJoinProps } from '../components/input-join';
import InputHost, { IProps as InputHostProps } from '../components/input-host';
import SelectAlpha from '../components/select-alpha';

interface IProps extends React.Props<{}>, InputJoinProps, InputHostProps {
    onChangeAlpha(alpha: number): void;
}

export default class Main extends React.Component<IProps, void> {
    constructor(props: IProps) {
        super(props);
    }

    private handleJoin(roomId: string): void {
        this.props.onJoin(roomId);
    }

    private handleLeave(): void {
        this.props.onLeave();
    }

    private handleChangeHost(websocketServerHost: string): void {
        this.props.onChangeHost(websocketServerHost);
    }

    private handleChangeAlpha(alpha: number): void {
        this.props.onChangeAlpha(alpha);
    }

    public render(): React.ReactElement<void> {
        return (
            <div>
                <InputJoin
                    status={this.props.status}
                    onJoin={this.handleJoin.bind(this)}
                    onLeave={this.handleLeave.bind(this)}
                />
                <SelectAlpha
                    onChange={this.handleChangeAlpha.bind(this)}
                />
                <InputHost
                    status={this.props.status}
                    websocketServerHost={this.props.websocketServerHost}
                    onChangeHost={this.handleChangeHost.bind(this)}
                />
            </div>
        );
    }
}

