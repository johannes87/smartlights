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
    this.setState({ lightStatuses: newLightStatuses });
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
  }

  render() {
    const isLoaded = Object.values(this.state.lightStatuses).length > 0;
    const loader = (
      <div className="LoaderContainer">
        <div className="Loader" />
      </div>
    );
    const lightSwitches = [
      <FormControlLabel
        control={
          <Switch
            checked={this.areSomeAvailableLightsTurnedOn()}
            onChange={this.handleAllLightsSwitchChange}
          />
        }
        label="All lights"
      />,
      Object.entries(this.state.lightStatuses).map(([lightId, lightStatus]) => (
        <SwitchAndColorPicker
          key={lightId}
          lightId={lightId}
          label={lightStatus.name}
          color={lightStatus.color}
          power={lightStatus.power}
          brightness={lightStatus.brightness}
          onPowerChange={this.handleLightPowerChange}
        />
      )),
    ];

    return (
      <FormGroup className="LightSwitches">
        {!isLoaded && loader}
        {isLoaded && lightSwitches}
      </FormGroup>
    );
  }
}

export default LightSwitches;
