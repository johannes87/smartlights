import React from 'react';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import * as API from '../API';
import SwitchAndColorPicker from './SwitchAndColorPicker';

class LightSwitches extends React.Component {
  state = {
    lightStatuses: {},
  };

  handleAllLightsSwitchChange = () => {
    const newLightStatuses = { ...this.state.lightStatuses };
    const newPowerStatus = this.areSomeAvailableLightsTurnedOn() ? 'off' : 'on';

    Object.keys(newLightStatuses).forEach((lightId) => {
      if (newLightStatuses[lightId].power !== 'disconnected') {
        newLightStatuses[lightId].power = newPowerStatus;
      }
      API.setLightPower(lightId, newPowerStatus);
    });

    this.setState({ lightStatuses: newLightStatuses });
  };

  handleLightPowerChange = (lightId, power) => {
    let newLightStatuses = { ...this.state.lightStatuses };
    newLightStatuses[lightId].power = power;
    API.setLightPower(lightId, power);
    this.setState({ lightStatuses: newLightStatuses });
  };

  handleLightColorChange = (lightId, color) => {
    let newLightStatuses = { ...this.state.lightStatuses };
    newLightStatuses[lightId].color = { r: color.r, g: color.g, b: color.b };
    newLightStatuses[lightId].brightness = color.a * 100;
    API.setLightColorAndBrightness(
      lightId,
      newLightStatuses[lightId].color,
      newLightStatuses[lightId].brightness
    );
    this.setState({ lightStatuses: newLightStatuses });
  };

  handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.setState({ lightStatuses: {} }); // show loader again
      this.fetchLights();
    }
  };

  areSomeAvailableLightsTurnedOn = () => {
    if (Object.values(this.state.lightStatuses).length === 0) {
      return false;
    }
    return Object.values(this.state.lightStatuses).some(
      (l) => l.power === 'on'
    );
  };

  async fetchLights() {
    const lightStatuses = await API.getLights();
    this.setState({ lightStatuses });
  }

  componentDidMount() {
    this.fetchLights();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
  }

  render() {
    const isLoaded = Object.values(this.state.lightStatuses).length > 0;
    const loader = (
      <div className="LoaderContainer">
        <div className="Loader" />
      </div>
    );
    const lightSwitches = (
      <>
        <FormControlLabel
          control={
            <Switch
              checked={this.areSomeAvailableLightsTurnedOn()}
              onChange={this.handleAllLightsSwitchChange}
            />
          }
          label="All lights"
        />
        {Object.entries(this.state.lightStatuses).map(
          ([lightId, lightStatus]) => (
            <SwitchAndColorPicker
              key={lightId}
              lightId={lightId}
              lightStatus={lightStatus}
              onPowerChange={this.handleLightPowerChange}
              onColorChange={this.handleLightColorChange}
            />
          )
        )}
      </>
    );

    return (
      <FormGroup className="LightSwitches">
        {!isLoaded && loader}
        {isLoaded && lightSwitches}
      </FormGroup>
    );
  }
}

export default LightSwitches;
