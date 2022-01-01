import React from 'react';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import * as API from '../API';
import SwitchAndColorPicker from './SwitchAndColorPicker';

class LightSwitches extends React.Component {
    state = {
      lightStatuses: {},
    };

    handleAllLightsSwitchChange = () => {
      const newLightStatuses = {...this.state.lightStatuses};
      const newPowerStatus = this.areAllAvailableLightsTurnedOn() ? 'off' : 'on';

      Object.keys(newLightStatuses).forEach(lightId => {
        if (newLightStatuses[lightId].power !== 'disconnected') {
          newLightStatuses[lightId].power = newPowerStatus;
        }
        API.setLightPower(lightId, newPowerStatus);
      });

      this.setState({ lightStatuses: newLightStatuses });
    };

    handleLightPowerChange = (lightId, power) => {
      let newLightStatuses = {...this.state.lightStatuses};
      newLightStatuses[lightId].power = power;
      this.setState({ lightStatuses: newLightStatuses });
    };

    areAllAvailableLightsTurnedOn = () => {
      if (Object.values(this.state.lightStatuses).length === 0) {
        return false;
      }
      return Object.values(this.state.lightStatuses).every(l => l.power === 'on' || l.power === 'disconnected');
    }

    async fetchLights() {
      const lightStatuses = await API.getLights();
      this.setState({ lightStatuses });
    }

    componentDidMount() {
      this.fetchLights();
    }

    render() {
      return (
        <FormGroup className="LightSwitches">
          <FormControlLabel
            control={
              <Switch
                checked={ this.areAllAvailableLightsTurnedOn() }
                onChange={ this.handleAllLightsSwitchChange }
              />
            }
            label="All lights"
          />
          { Object.values(this.state.lightStatuses).length === 0 && <div className='LoaderContainer'><div className='Loader' /></div> }
          { Object.entries(this.state.lightStatuses).map(([lightId, lightStatus]) =>
            <SwitchAndColorPicker
              key={ lightId }
              lightId={ lightId }
              label={ lightStatus.name }
              color={ lightStatus.color }
              power={ lightStatus.power }
              brightness={ lightStatus.brightness }
              onPowerChange={ this.handleLightPowerChange }
            />
          ) }
        </FormGroup>
      );
    }
  }

  export default LightSwitches;