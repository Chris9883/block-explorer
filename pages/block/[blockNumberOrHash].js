import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlockDetails } from "@/scripts/alchemyApi";
import { Box, Container, Paper, TextField, Typography } from "@mui/material";

const Block = () => {
  const router = useRouter();
  const { blockNumberOrHash } = router.query;

  const [blockNumber, setBlockNumber] = useState("");
  const [blockhash, setBlockhash] = useState("");
  const [feeRecipient, setFeeRecipient] = useState();
  const [timestamp, setTimestamp] = useState("");
  const [gasUsed, setGasUsed] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [baseFeePerGas, setBaseFeePerGas] = useState("");
  const [extraData, setExtraData] = useState("");
  const [parentHash, setParentHash] = useState("");
  const [numTransactions, setNumTransactions] = useState();

  // removed : status, block reward, total difficulty, block size, burnt fees, state root
  useEffect(() => {
    if (blockNumberOrHash) {
      getBlockDetails(
        blockNumberOrHash,
        setBlockNumber,
        setBlockhash,
        setFeeRecipient,
        setTimestamp,
        setGasUsed,
        setGasLimit,
        setBaseFeePerGas,
        setExtraData,
        setParentHash,
        setNumTransactions
      );
    }
  }, [blockNumberOrHash]);
  //if not a valid address redirect to 404
  return (
    <Box className="content">
      <Box className="title">
        <Typography variant="h6">Block: {blockNumber}</Typography>
      </Box>
      <Box mt={2}>
        <Paper
          className="info-box"
          elevation={3}
          sx={{
            width: "1000px",
            backgroundColor: "#ffffff",
          }}
        >
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Block number:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {blockNumber}
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Block Hash:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {blockhash}
            </Typography>
          </Container>

          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Timestamp:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {new Date(timestamp * 1000).toLocaleDateString()},{" "}
              {new Date(timestamp * 1000).toLocaleTimeString()}
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Transactions:
            </Typography>
            {numTransactions && (
              <Typography variant="body2" className="blockinfo-content">
                {numTransactions} transactions
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Fee recipient:
            </Typography>
            {feeRecipient && (
              <Link href={`/address/${feeRecipient}`}>
                <Typography variant="body2" className="blockinfo-content">
                  {feeRecipient}
                </Typography>
              </Link>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Gas Used:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {gasUsed.toLocaleString()}
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Gas Limit:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {gasLimit.toLocaleString()}
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Base Fee per Gas:
            </Typography>
            {baseFeePerGas && (
              <Typography variant="body2" className="blockinfo-content">
                {baseFeePerGas} Gwei
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Extra Data:
            </Typography>
            <TextField
              multiline
              maxRows={4}
              variant="filled"
              disabled
              value={extraData}
            />
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Parent Hash:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {parentHash}
            </Typography>
          </Container>
        </Paper>
      </Box>
    </Box>
  );
};

export default Block;
