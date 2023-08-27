import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

export default function ConfirmPresetDeletionDialog({
  presetName,
  onClose,
  onDeleteConfirmed,
}) {
  return (
    <Dialog
      open={!!presetName}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>
            Please confirm if you are reeeaaallly sure that you want to delete
            the preset with the following name: <strong>{presetName}</strong>
          </p>
          <p>
            In the end, it's just a preset, so don't worry too much about it!
            But you might as well be really sure.
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} autoFocus>
          No! I don't want to change anything!
        </Button>
        <Button variant="contained" onClick={onDeleteConfirmed}>
          Delete Preset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
