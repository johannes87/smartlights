import { FormControlLabel, Switch } from '@mui/material';

export default function LightSwitch({ lightStatus, onSwitchChange }) {
  return (
    <FormControlLabel
      control={
        <Switch
          disabled={lightStatus.power === 'disconnected'}
          checked={lightStatus.power === 'on'}
          onChange={onSwitchChange}
        />
      }
      label={lightStatus.name}
    />
  );
}
