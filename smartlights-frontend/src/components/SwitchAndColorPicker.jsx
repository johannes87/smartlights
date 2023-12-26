import React from 'react';
import { RgbColorPicker } from 'react-colorful';
import { FormControlLabel, Switch } from '@mui/material';
import BrightnessControlDialog from './BrightnessControlDialog';
import BrightnessIndicator from './BrightnessIndicator';

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

    const lightSwitch = (
      <Switch
        disabled={this.props.lightStatus.power === 'disconnected'}
        checked={this.props.lightStatus.power === 'on'}
        onChange={this.handleSwitchChange}
      />
    );

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
        <FormControlLabel
          control={lightSwitch}
          label={this.props.lightStatus.name}
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
