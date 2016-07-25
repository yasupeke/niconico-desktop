import * as React from 'react';
import { Slider } from 'material-ui';
import { ImageBlurLinear } from 'material-ui/svg-icons';

interface IProps extends React.Props<{}> {
    onChange(alpha: number): void;
}

const MIN = 0;
const MAX = 1;
const STEP = 0.1;
const wrapperStyles = {
    display: 'flex',
    alignItems: 'center'
}

const iconStyles = {
    display: 'block',
    marginRight: '12px',
}

const sliderWrapperStyles = {
    flex: 1,
    marginBottom: '-24px'
}

const sliderStyles = {
    sliderStyles: '200px'
}

export default class SelectAlpha extends React.Component<IProps, void> {
    constructor(props: IProps) {
        super(props);
    }

    private handleChange(e: React.MouseEvent, alpha: number): void {
        this.props.onChange(alpha);
    }

    public render(): React.ReactElement<void> {
        return (
            <div
                style={wrapperStyles}
            >
                <ImageBlurLinear
                    style={iconStyles}
                />
                <Slider
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    defaultValue={MAX}
                    onChange={this.handleChange.bind(this)}
                    style={sliderWrapperStyles}
                    sliderStyle={sliderStyles}
                />
            </div>
        );
    }

}