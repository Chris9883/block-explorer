import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Box, Container, Paper, TextField, Typography } from "@mui/material";
import { getTransactionDetails } from "@/scripts/alchemyApi.js";

const Transaction = () => {
  const router = useRouter();
  const { txHash } = router.query;
  const dynamicRoute = useRouter().asPath;

  const [blockNumber, setBlockNumber] = useState();
  const [index, setIndex] = useState();
  const [confirmations, setConfirmations] = useState();
  const [sender, setSender] = useState();
  const [recipient, setRecipient] = useState();
  const [value, setValue] = useState();
  const [data, setData] = useState();
  // contract creation
  const [creates, setCreates] = useState();
  const [baseFee, setBaseFee] = useState();
  const [gasPrice, setGasPrice] = useState();
  const [gasLimit, setGasLimit] = useState();
  const [gasUsed, setGasUsed] = useState();
  const [maxFeePerGas, setMaxFeePerGas] = useState();
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState();
  const [nonce, setNonce] = useState();
  const [r, setR] = useState();
  const [s, setS] = useState();
  const [v, setV] = useState();
  const [type, setType] = useState();

  // reset state on route change
  useEffect(() => {
    setBlockNumber();
    setIndex();
    setConfirmations();
    setSender();
    setRecipient();
    setValue();
    setData();
    setCreates();
    setBaseFee();
    setGasPrice();
    setGasLimit();
    setGasUsed();
    setMaxFeePerGas();
    setMaxPriorityFeePerGas();
    setNonce();
    setR();
    setS();
    setV();
    setType();
  }, [dynamicRoute]);

  useEffect(() => {
    if (txHash) {
    }
    async function fetch() {
      const result = await getTransactionDetails(
        txHash,
        setBlockNumber,
        setIndex,
        setConfirmations,
        setSender,
        setRecipient,
        setValue,
        setData,
        setCreates,
        setBaseFee,
        setGasPrice,
        setGasLimit,
        setGasUsed,
        setMaxFeePerGas,
        setMaxPriorityFeePerGas,
        setNonce,
        setR,
        setS,
        setV,
        setType
      );
      // if not a valid txHash, redirect to block page to determine if a blockHash
      if (result == false) {
        router.replace(`/block/${txHash}`);
      }
    }
    fetch();
  }, [txHash, router]);

  return (
    <Box className="content">
      <Box className="title">
        <Typography variant="h6">Transaction</Typography>
      </Box>
      <Box>
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
              Transaction Hash:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {txHash}
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Status:
            </Typography>
            {confirmations > 0 && (
              <Typography variant="body2" className="blockinfo-description">
                <span className="success-text">Successfully</span> included in
                Block{" "}
                {blockNumber && (
                  <span>
                    <Link href={`/block/${blockNumber}`}>{blockNumber}</Link> at
                    position {index}
                  </span>
                )}
                <span className="success">{confirmations} confirmations</span>
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              From:
            </Typography>
            {sender && (
              <Link href={`/address/${sender}`}>
                {" "}
                <Typography variant="body2" className="blockinfo-content">
                  {sender}
                </Typography>
              </Link>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              To:
            </Typography>
            {recipient && (
              <Link href={`/address/${recipient}`}>
                <Typography variant="body2" className="blockinfo-content">
                  {recipient}
                </Typography>
              </Link>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Value:
            </Typography>
            {value && (
              <Typography variant="body2" className="blockinfo-content">
                {value} Ether
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Input Data:
            </Typography>
            <TextField
              multiline
              maxRows={4}
              variant="filled"
              disabled
              value={data}
            />
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Transaction Fee:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {(gasPrice * gasUsed) / 1000000000} Ether
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Gas Price:
            </Typography>
            <Typography variant="body2" className="blockinfo-content">
              {gasPrice} Gwei
            </Typography>
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Gas Limit / Used:
            </Typography>
            {gasLimit && (
              <Typography variant="body2" className="blockinfo-content">
                {gasLimit} / {gasUsed}
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Gas Fees
            </Typography>
            {maxFeePerGas && (
              <Typography variant="body2" className="blockinfo-content">
                Base: {baseFee} Gwei / Max: {maxFeePerGas} Gwei / Max Priority:{" "}
                {maxPriorityFeePerGas} Gwei
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Nonce:
            </Typography>
            {nonce && (
              <Typography variant="body2" className="blockinfo-content">
                {nonce}
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              Transaction type:
            </Typography>
            {nonce && (
              <Typography variant="body2" className="blockinfo-content">
                {type}
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              r:
            </Typography>
            {r && (
              <Typography variant="body2" className="blockinfo-content">
                {recipient}
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              s:
            </Typography>
            {s && (
              <Typography variant="body2" className="blockinfo-content">
                {s}
              </Typography>
            )}
          </Container>
          <Container className="blockinfo-container">
            <Typography variant="body2" className="blockinfo-description">
              v:
            </Typography>
            {v && (
              <Typography variant="body2" className="blockinfo-content">
                {v}
              </Typography>
            )}
          </Container>
        </Paper>
      </Box>
    </Box>
  );
};

export default Transaction;
