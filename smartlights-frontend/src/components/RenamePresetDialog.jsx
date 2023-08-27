import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

export default function RenamePresetDialog({
  presetName,
  onNewNameChosen,
  onClose,
}) {
  const [newPresetName, setNewPresetName] = useState('');

  const formSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (
        newPresetName.trim() !== '' &&
        newPresetName.trim() !== presetName.trim()
      ) {
        onNewNameChosen(presetName, newPresetName.trim());
      }
    },
    [onNewNameChosen, presetName, newPresetName]
  );

  useEffect(() => {
    if (presetName) {
      setNewPresetName(presetName);
    }
  }, [presetName]);

  return (
    <Dialog
      className="rename-preset-dialog-component"
      open={!!presetName}
      onClose={onClose}
      aria-labelledby="rename-preset-dialog-title"
      aria-describedby="rename-preset-dialog-description"
    >
      <form onSubmit={formSubmit}>
        <DialogTitle id="rename-preset-dialog-title">
          Enter a new name
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="rename-preset-dialog-description">
            Enter a name, which will become the new name of the preset{' '}
            <strong>{presetName}</strong>.
          </DialogContentText>
          <div className="textfield-container">
            <TextField
              autoFocus
              label="New name for the preset"
              variant="filled"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Rename Preset
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
