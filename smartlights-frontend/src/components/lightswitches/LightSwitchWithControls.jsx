import React from 'react';
import { RgbColorPicker } from 'react-colorful';
import BrightnessControlDialog from './BrightnessControlDialog';
import BrightnessIndicator from './BrightnessIndicator';
import LightSwitch from './LightSwitch';
import ColorIndicator from './ColorIndicator';

class LightSwitchWithControls extends React.Component {
  state = {
    displayColorPicker: false,
    displayBrightnessControl: false,
  };

  handleColorIndicatorClick = () => {
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
        <ColorIndicator
          lightStatus={this.props.lightStatus}
          onIndicatorClick={this.handleColorIndicatorClick}
        />
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

export default LightSwitchWithControls;
