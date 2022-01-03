import React from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { FormControlLabel, Switch } from '@mui/material';
import * as API from '../API';

class SwitchAndColorPicker extends React.Component {
  state = {
    color: { ...this.props.color, a: this.props.brightness / 100 },
    power: this.props.power,
    displayColorPicker: false,
  };

  handleColorButtonClick = () => {
    if (this.state.power === 'disconnected') {
      return;
    }
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorChange = (color) => {
    this.setState({ color });
    const lightColor = { r: color.r, g: color.g, b: color.b };
    API.setLightColorAndBrightness(
      this.props.lightId,
      lightColor,
      color.a * 100
    );
  };

  handleSwitchChange = () => {
    const newPowerState = this.state.power === 'on' ? 'off' : 'on';
    this.setState({ power: newPowerState });
    API.setLightPower(this.props.lightId, newPowerState);
    this.props.onPowerChange &&
      this.props.onPowerChange(this.props.lightId, newPowerState);
  };

  static getDerivedStateFromProps(props, state) {
    if (state.power !== props.power) {
      return { power: props.power };
    }
    return null;
  }

  render() {
    let colorButtonClasses = 'ColorButton';
    let colorButtonStyle = null;
    if (this.state.power !== 'disconnected') {
      colorButtonClasses += ' Enabled';

      const { r, g, b, a } = this.state.color;
      colorButtonStyle = {
        background: `rgba(${r},${g},${b},${a})`,
      };
    }

    const colorButton = (
      <div
        className={colorButtonClasses}
        style={colorButtonStyle}
        onClick={this.handleColorButtonClick}
      />
    );

    const switchControl = (
      <Switch
        disabled={this.state.power === 'disconnected'}
        checked={this.state.power === 'on'}
        onChange={this.handleSwitchChange}
      />
    );

    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker = (
        <div className="ColorPicker">
          <div className="Cover" onClick={this.handleColorPickerClose} />
          <RgbaColorPicker
            color={this.state.color}
            onChange={this.handleColorChange}
          />
        </div>
      );
    }

    return (
      <div className="SwitchAndColorPicker">
        {colorButton}
        <FormControlLabel control={switchControl} label={this.props.label} />
        {colorPicker}
      </div>
    );
  }
}

export default SwitchAndColorPicker;
