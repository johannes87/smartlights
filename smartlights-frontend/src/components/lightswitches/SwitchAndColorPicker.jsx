import React from 'react';
import { RgbColorPicker } from 'react-colorful';
import BrightnessControlDialog from './BrightnessControlDialog';
import BrightnessIndicator from './BrightnessIndicator';
import LightSwitch from './LightSwitch';

class SwitchAndColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    displayBrightnessControl: false,
  };

  handleColorButtonClick = () => {
    this.setState((prevState) => ({
      displayColorPicker: !prevState.displayColorPicker,
    }));
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorChange = (color) => {
    this.props?.onColorChange(this.props.lightId, color);
  };

  handleSwitchChange = () => {
    this.props?.onPowerChange(
      this.props.lightId,
      this.props.lightStatus.power === 'on' ? 'off' : 'on',
    );
  };

  handleBrightnessIndicatorClick = () => {
    this.setState((prevState) => ({
      displayBrightnessControl: !prevState.displayBrightnessControl,
    }));
  };

  render() {
    const colorPickerButton = () => {
      let classNames = 'ColorPickerButton';
      let style = null;
      let onClick = null;

      if (this.props.lightStatus.power !== 'disconnected') {
        const { r, g, b } = this.props.lightStatus.color;
        style = {
          background: `rgb(${r},${g},${b})`,
        };
      }

      if (this.props.lightStatus.power === 'on') {
        classNames += ' Enabled';
        onClick = this.handleColorButtonClick;
      }

      return <div className={classNames} style={style} onClick={onClick} />;
    };

    const colorPicker = () =>
      this.state.displayColorPicker && (
        <div className="ColorPicker">
          <div className="Cover" onClick={this.handleColorPickerClose} />
          <RgbColorPicker
            color={{ ...this.props.lightStatus.color }}
            onChange={this.handleColorChange}
          />
        </div>
      );

    return (
      <div className="switch-and-color-picker-component">
        {colorPickerButton()}
        <BrightnessIndicator
          onIndicatorClick={this.handleBrightnessIndicatorClick}
          currentBrightness={this.props.lightStatus.brightness}
        />
        <LightSwitch
          lightStatus={this.props.lightStatus}
          onSwitchChange={this.handleSwitchChange}
        />
        {colorPicker()}
        <BrightnessControlDialog
          open={this.state.displayBrightnessControl}
          onClose={() => this.setState({ displayBrightnessControl: false })}
          lightId={this.props.lightId}
          currentBrightness={this.props.lightStatus.brightness}
          onBrightnessChange={(lightId, newValue) =>
            this.props.onBrightnessChange(lightId, newValue)
          }
        />
      </div>
    );
  }
}

export default SwitchAndColorPicker;
