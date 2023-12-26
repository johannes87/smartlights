import { BrightnessHigh, BrightnessLow } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
} from '@mui/material';

export default function BrightnessControlDialog({
  open,
  onClose,
  lightId,
  onBrightnessChange,
  currentBrightness,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      className="brightness-control-dialog-component"
    >
      <DialogTitle>Set brightness</DialogTitle>
      <DialogContent>
        <div className="info-text">
          Use the slider to set the brightness of the light:
        </div>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <BrightnessLow />
          <Slider
            aria-label="Brightness percentage"
            value={currentBrightness}
            onChange={(event, newValue) =>
              onBrightnessChange(lightId, newValue)
            }
          />
          <BrightnessHigh />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
