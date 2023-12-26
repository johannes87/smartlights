import React from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { FormControlLabel, Switch } from '@mui/material';

class SwitchAndColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
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

  render() {
    const alphaColor = this.props.lightStatus.brightness / 100;

    const colorPickerButton = () => {
      let classNames = 'ColorPickerButton';
      let style = null;
      let onClick = null;

      if (this.props.lightStatus.power !== 'disconnected') {
        const { r, g, b } = this.props.lightStatus.color;
        style = {
          background: `rgba(${r},${g},${b},${alphaColor})`,
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
          <RgbaColorPicker
            color={{ ...this.props.lightStatus.color, a: alphaColor }}
            onChange={this.handleColorChange}
          />
        </div>
      );

    return (
      <div className="switch-and-color-picker-component">
        {colorPickerButton()}
        <FormControlLabel
          control={lightSwitch}
          label={this.props.lightStatus.name}
        />
        {colorPicker()}
      </div>
    );
  }
}

export default SwitchAndColorPicker;
