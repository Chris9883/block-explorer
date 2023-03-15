import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlockDetails } from "@/scripts/alchemyApi";
import {
  Box,
  TableRow,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import TabPanel from "@/components/TabPanel";

const Block = () => {
  const router = useRouter();
  const { blockNumberOrHash } = router.query;
  const dynamicRoute = useRouter().asPath;

  const [blockNumber, setBlockNumber] = useState();
  const [blockhash, setBlockhash] = useState();
  const [feeRecipient, setFeeRecipient] = useState();
  const [timestamp, setTimestamp] = useState();
  const [gasUsed, setGasUsed] = useState();
  const [gasLimit, setGasLimit] = useState();
  const [baseFeePerGas, setBaseFeePerGas] = useState();
  const [extraData, setExtraData] = useState();
  const [parentHash, setParentHash] = useState();
  const [transactions, setTransactions] = useState([]);

  // reset state on route change
  useEffect(() => {
    setBlockNumber();
    setBlockhash();
    setFeeRecipient();
    setTimestamp();
    setGasUsed();
    setGasLimit();
    setBaseFeePerGas();
    setExtraData();
    setParentHash();
    setTransactions([]);
  }, [dynamicRoute]);
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
        setTransactions
      );
    }
  }, [blockNumberOrHash]);
  //if not a valid address redirect to 404

  // tabs
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="content">
      <Box className="title">
        <Typography variant="h6">Block: {blockNumber}</Typography>
      </Box>

      <Paper
        className="info-box"
        elevation={3}
        sx={{
          width: "1000px",
          backgroundColor: "#ffffff",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Overview" />
            <Tab label="Transactions" id="block-tx-tab" disabled />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Table>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Block number:</Typography>
              </TableCell>
              <TableCell>
                {blockNumber && (
                  <Typography variant="body1">{blockNumber}</Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Block Hash:</Typography>
              </TableCell>
              <TableCell>
                {blockhash && (
                  <Typography variant="body1">{blockhash}</Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Timestamp:</Typography>
              </TableCell>
              <TableCell>
                {timestamp && (
                  <Typography variant="body1">
                    {new Date(timestamp * 1000).toLocaleDateString()},{" "}
                    {new Date(timestamp * 1000).toLocaleTimeString()}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Transactions:</Typography>
              </TableCell>
              <TableCell>
                {transactions && (
                  <Typography variant="body1">
                    {transactions.length} transactions
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Fee recipient:</Typography>
              </TableCell>
              <TableCell>
                {feeRecipient && (
                  <Link href={`/address/${feeRecipient}`}>
                    <Typography variant="body1">{feeRecipient}</Typography>
                  </Link>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Gas Used:</Typography>
              </TableCell>
              <TableCell>
                {gasUsed && (
                  <Typography variant="body1">
                    {gasUsed.toLocaleString()}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Gas Limit:</Typography>
              </TableCell>
              <TableCell>
                {gasLimit && (
                  <Typography variant="body1">
                    {gasLimit.toLocaleString()}
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="body1">Extra Data:</Typography>
              </TableCell>
              <TableCell>
                {extraData && (
                  <TextField
                    multiline
                    maxRows={4}
                    variant="filled"
                    disabled
                    value={extraData}
                  />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Parent Hash:</Typography>
              </TableCell>
              <TableCell>
                {parentHash && (
                  <Link href={`/block/${parentHash}`}>
                    <Typography variant="body1">{parentHash}</Typography>
                  </Link>
                )}
              </TableCell>
            </TableRow>
          </Table>
        </TabPanel>
        <TabPanel value={value} index={1} id="block-transactions">
          transactions
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Block;
