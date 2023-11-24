import { Snackbar, Alert, AlertColor } from "@mui/material";

type NotificationProps = {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void; 
}

export const Notification = ({ open, message, severity, onClose }: NotificationProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
