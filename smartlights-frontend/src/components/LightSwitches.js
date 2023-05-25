import React from 'react';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import * as API from '../API';
import SwitchAndColorPicker from './SwitchAndColorPicker';
import { connect } from 'react-redux';
import { fetchLights, setLights } from '../redux/slices/lightsSlice';

class LightSwitches extends React.Component {
  handleAllLightsSwitchChange = () => {
    const newLightStatuses = { ...this.props.lights };
    const newPowerStatus = this.areSomeAvailableLightsTurnedOn() ? 'off' : 'on';

    Object.keys(newLightStatuses).forEach((lightId) => {
      if (newLightStatuses[lightId].power !== 'disconnected') {
        newLightStatuses[lightId].power = newPowerStatus;
      }
      API.setLightPower(lightId, newPowerStatus);
    });
    this.props.setLights(newLightStatuses);
  };

  handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.props.setLights({}); // show loader again
      this.props.fetchLights();
    }
  };

  areSomeAvailableLightsTurnedOn = () => {
    if (Object.values(this.props.lights).length === 0) {
      return false;
    }
    return Object.values(this.props.lights).some((l) => l.power === 'on');
  };

  componentDidMount() {
    this.props.fetchLights();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
  }

  render() {
    const isLoaded = Object.values(this.props.lights).length > 0;
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
        {Object.entries(this.props.lights).map(([lightId, lightStatus]) => (
          <SwitchAndColorPicker key={lightId} lightId={lightId} />
        ))}
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

const mapStateToProps = (state) => {
  return {
    lights: state.lights.lights,
  };
};

const mapDispatchToProps = {
  fetchLights,
  setLights,
};

export default connect(mapStateToProps, mapDispatchToProps)(LightSwitches);
