import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button } from "@mui/material";

export default function CopyButton() {
  return (
    <Button variant="text" color="info" className="copy-icon-container">
      <ContentCopyIcon className="copy-icon" />
    </Button>
  );
}
