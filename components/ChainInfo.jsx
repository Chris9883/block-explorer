import Link from "next/link";

import { Box, Typography } from "@mui/material";

export default function ChainInfo({ currentBlock, gasPrice }) {
  return (
    <Box className="chain-info">
      <Typography variant="body1" color="typography.accent">
        Latest block:{" "}
        <Link href={`/block/${currentBlock}`}>{currentBlock}</Link>
      </Typography>
      {gasPrice && (
        <Typography variant="body1" color="typography.accent">
          Gas: {gasPrice} gwei
        </Typography>
      )}
    </Box>
  );
}
