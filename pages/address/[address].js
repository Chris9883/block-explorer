import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAccountDetails,
  getTokens,
  getNfts,
  getNftsByContract,
  getTokensByContract,
} from "@/scripts/alchemyApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import TabPanel from "@/components/TabPanel";

const Address = () => {
  const router = useRouter();
  const { address } = router.query;
  const dynamicRoute = useRouter().asPath;

  // type: eoa (externally owned account) or contract
  const [type, setType] = useState();
  const [balance, setBalance] = useState();
  const [code, setCode] = useState();
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [contractAddress, setContractAddress] = useState();
  const [nfts, setNfts] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [loading, setLoading] = useState(false);

  // reset state on route change
  useEffect(() => {
    setType();
    setBalance();
    setCode();
    setOutgoing([]);
    setIncoming([]);
    setTokenBalances([]);
    setContractAddress();
    setNfts([]);
    setTotalCount();
  }, [dynamicRoute]);

  useEffect(() => {
    if (address) {
      getAccountDetails(
        address,
        setBalance,
        setType,
        setCode,
        setOutgoing,
        setIncoming,
        setLoading
      );
    }
  }, [address]);

  function lookupNfts() {
    // input validation
    if (contractAddress) {
      let trimmedInput = contractAddress.trim();
      if (trimmedInput.length == 42 && trimmedInput.startsWith("0x")) {
        getNftsByContract(
          address,
          trimmedInput,
          setNfts,
          setTotalCount,
          setLoading
        );
      }
    }
  }

  function lookupToken() {
    // input validation
    if (contractAddress) {
      let trimmedInput = contractAddress.trim();
      if (trimmedInput.length == 42 && trimmedInput.startsWith("0x")) {
        getTokensByContract(
          address,
          trimmedInput,
          setTokenBalances,
          setLoading
        );
      }
    }
  }

  const displayNfts = nfts.map((e, i) => {
    return (
      <Card sx={{ width: 200 }} key={i} className="nft">
        <Link href={`/address/${e.address}`}>
          <CardMedia image={nfts[i].image} sx={{ height: 200 }}></CardMedia>
        </Link>

        <CardContent>
          <Typography className="nft-name" variant="body1">
            {nfts[i].name && nfts[i].name != ""
              ? nfts[i].name
              : nfts[i].address}
          </Typography>
          <Typography className="nft-details" variant="body1">
            {nfts[i].symbol} #{nfts[i].tokenId}
          </Typography>
        </CardContent>
      </Card>
    );
  });

  const displayOutgoing = outgoing.map((e, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Link href={`/block/${e.blockNumber}`}>
            <Typography variant="body1" className="table-data">
              {e.blockNumber}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Link href={`/tx/${e.txHash}`}>
            <Typography variant="body1" className="table-data">
              {e.txHash}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.type}
          </Typography>
        </TableCell>
        <TableCell>
          <Link href={`/address/${e.to}`}>
            <Typography variant="body1" className="table-data">
              {e.to}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.value}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.asset}
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  const displayIncoming = incoming.map((e, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Link href={`/block/${e.blockNumber}`}>
            <Typography variant="body1" className="table-data">
              {e.blockNumber}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Link href={`/tx/${e.txHash}`}>
            <Typography variant="body1" className="table-data">
              {e.txHash}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.type}
          </Typography>
        </TableCell>
        <TableCell>
          <Link href={`/address/${e.from}`}>
            <Typography variant="body1" className="table-data">
              {e.from}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.value}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.asset}
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  const displayTokens = tokenBalances.map((e, i) => {
    return (
      <TableRow key={i}>
        {" "}
        <TableCell>
          <Typography variant="body1" className="table-data symbol">
            {e.symbol}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.decimals == 0 ? e.balance : e.balance % e.decimals}
          </Typography>
        </TableCell>
        <TableCell>
          <Link href={`/address/${e.address}`}>
            <Typography variant="body1" className="table-data">
              {e.address}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Typography variant="body1" className="table-data">
            {e.name}
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  // tabs
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="content">
      <Box className="title">
        {" "}
        {type === "eoa" ? (
          <Typography variant="h6">Address: {address}</Typography>
        ) : (
          <Typography variant="h6">Contract: {address}</Typography>
        )}
      </Box>
      <Box mt={2}>
        <Container className="account-info">
          <Typography variant="body1" className="balance-description">
            Balance:
          </Typography>
          {balance && (
            <Typography variant="body1" className="balance">
              {balance} Eth
            </Typography>
          )}
        </Container>
      </Box>

      <Paper elevation={3} className="block-container" sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Outgoing transactions" />
            <Tab label="Incoming transactions" />
            <Tab label="Tokens" />
            <Tab label="NFTs" />
            {type === "contract" && <Tab label="Code" />}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Container className="tabpanel-content">
            <Table>
              <TableHead>
                <TableCell className="table-header">Block</TableCell>
                <TableCell className="table-header">Transaction Hash</TableCell>
                <TableCell className="table-header">Type</TableCell>
                <TableCell className="table-header">To</TableCell>
                <TableCell className="table-header">Value</TableCell>
                <TableCell className="table-header">Asset</TableCell>
              </TableHead>
              <TableBody>{displayOutgoing}</TableBody>
            </Table>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container className="tabpanel-content">
            <Table>
              <TableHead>
                <TableCell className="table-header">Block</TableCell>
                <TableCell className="table-header">Transaction Hash</TableCell>
                <TableCell className="table-header">Type</TableCell>
                <TableCell className="table-header">From</TableCell>
                <TableCell className="table-header">Value</TableCell>
                <TableCell className="table-header">Asset</TableCell>
              </TableHead>
              <TableBody>{displayIncoming}</TableBody>
            </Table>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container className="tabpanel-content">
            <Container className="searchTokens">
              <Button
                className="btn-small"
                variant="contained"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  getTokens(address, setTokenBalances, setTotalCount);
                }}
              >
                Show all tokens
              </Button>
              <Typography variant="body1">or</Typography>
              <TextField
                className="textfield-small"
                id="standard-basic"
                label="Enter token contract address"
                variant="outlined"
                size="small"
                value={contractAddress}
                onChange={(e) => {
                  e.preventDefault();
                  setContractAddress(e.target.value);
                }}
              />
              <Button
                variant="contained"
                className="btn-small"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  lookupToken;
                  setContractAddress("");
                }}
              >
                Search
              </Button>
            </Container>
            <Container className="display-tokens">
              {tokenBalances[0] && (
                <Table>
                  <TableHead>
                    <TableCell className="table-header symbol">
                      Symbol
                    </TableCell>
                    <TableCell className="table-header">Balance</TableCell>
                    <TableCell className="table-header">
                      Token Address
                    </TableCell>
                    <TableCell className="table-header">Full Name</TableCell>
                  </TableHead>
                  <TableBody>{displayTokens}</TableBody>
                </Table>
              )}
            </Container>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Container className="tabpanel-content">
            <Container className="searchNfts">
              <Button
                className="btn-small"
                variant="contained"
                onClick={() => getNfts(address, setNfts, setTotalCount)}
                size="small"
              >
                Show all NFTs
              </Button>
              <Typography variant="body1">or</Typography>
              <TextField
                className="textfield-small"
                id="standard-basic"
                label="Enter NFT contract address"
                variant="outlined"
                size="small"
                value={contractAddress}
                onChange={(e) => {
                  e.preventDefault();
                  setContractAddress(e.target.value);
                }}
              />
              <Button
                variant="contained"
                type="submit"
                className="btn-small"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  lookupNfts();
                  setContractAddress("");
                }}
              >
                Search
              </Button>
            </Container>
            {totalCount == 0 ? (
              <Container className="display-nfts">
                <Typography variant="body1">
                  This address doesn&apos;t own any NFTs.
                </Typography>
              </Container>
            ) : (
              <Container className="display-nfts">{displayNfts}</Container>
            )}
          </Container>
        </TabPanel>
        {type === "contract" && (
          <TabPanel value={value} index={4}>
            <Container className="tabpanel-content">
              <TextField
                className="code"
                multiline
                variant="filled"
                disabled
                value={code}
              />
            </Container>
          </TabPanel>
        )}
      </Paper>
    </Box>
  );
};

export default Address;
