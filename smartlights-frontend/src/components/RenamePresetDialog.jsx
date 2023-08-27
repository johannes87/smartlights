import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function RenamePresetDialog({
  presetName,
  onNewNameChosen,
  onClose,
}) {
  const [newPresetName, setNewPresetName] = useState('');

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
            label="New name for the preset"
            variant="filled"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (
              newPresetName.trim() !== '' &&
              newPresetName.trim() !== presetName.trim()
            ) {
              onNewNameChosen(presetName, newPresetName.trim());
            }
          }}
        >
          Rename Preset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
