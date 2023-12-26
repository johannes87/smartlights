import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import * as API from '../../Api';
import LightSwitchWithControls from './LightSwitchWithControls';
import { triggerReload } from 'redux/slices/lightsSlice';

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
    API.setLightColor(
      lightId,
      newLightStatuses[lightId].color,
    );
    this.setState({ lightStatuses: newLightStatuses });
  };

  handleLightBrightnessChange = async (lightId, brightness) => {
    await API.setLightBrightness(lightId, brightness);
    this.setState((prevState) => {
      const { lightStatuses } = prevState;
      lightStatuses[lightId].brightness = brightness;
      return lightStatuses;
    });
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
      (l) => l.power === 'on',
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
      this.handleVisibilityChange,
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.triggerReloadHack !== this.props.triggerReloadHack) {
      this.fetchLights();
    }
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
        <div className="all-lights-toggle">
          <FormControlLabel
            control={
              <Switch
                checked={this.areSomeAvailableLightsTurnedOn()}
                onChange={this.handleAllLightsSwitchChange}
              />
            }
            label="All lights"
          />
        </div>
        {Object.entries(this.state.lightStatuses).map(
          ([lightId, lightStatus]) => (
            <LightSwitchWithControls
              key={lightId}
              lightId={lightId}
              lightStatus={lightStatus}
              onPowerChange={this.handleLightPowerChange}
              onColorChange={this.handleLightColorChange}
              onBrightnessChange={this.handleLightBrightnessChange}
            />
          ),
        )}
      </>
    );

    return (
      <FormGroup className="light-switches-component">
        {!isLoaded && loader}
        {isLoaded && lightSwitches}
      </FormGroup>
    );
  }
}

const mapStateToProps = (state) => ({
  triggerReloadHack: state.lights.triggerReloadHack,
});

const mapDispatchToProps = { triggerReload };

export default connect(mapStateToProps, mapDispatchToProps)(LightSwitches);
