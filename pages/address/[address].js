import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Address = () => {
  const router = useRouter();
  const { address } = router.query;

  // type: eoa (externally owned account) or contract
  const [type, setType] = useState("eoa");
  const [balance, setBalance] = useState();
  const [code, setCode] = useState();
  const [outgoing, setOutgoing] = useState();
  const [incoming, setIncoming] = useState();
  const [tokenBalances, setTokenBalances] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [nfts, setNfts] = useState([]);
  const [totalCount, setTotalCount] = useState();

  useEffect(() => {
    if (address) {
      getAccountDetails(
        address,
        setBalance,
        setType,
        setCode,
        setOutgoing,
        setIncoming
      );
    }
  }, [address]);

  function lookupNfts() {
    // input validation
    if (contractAddress) {
      let trimmedInput = contractAddress.trim();
      if (trimmedInput.length == 42 && trimmedInput.startsWith("0x")) {
        getNftsByContract(address, trimmedInput, setNfts, setTotalCount);
      }
    }
  }

  function lookupToken() {
    // input validation
    if (contractAddress) {
      let trimmedInput = contractAddress.trim();
      if (trimmedInput.length == 42 && trimmedInput.startsWith("0x")) {
        getTokensByContract(address, trimmedInput, setTokenBalances);
      }
    }
  }

  const displayNfts = nfts.map((e, i) => {
    return (
      <Card sx={{ width: 200 }} key={i} className="nft">
        <CardMedia image={nfts[i].image} sx={{ height: 200 }}></CardMedia>

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
  // tabs
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (type === "eoa") {
    return (
      <Box className="content">
        <Box className="title">
          <Typography variant="h6">Address: {address}</Typography>
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
              <Tab label="Transactions" />
              <Tab label="Tokens" />
              <Tab label="NFTs" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Container className="tabpanel-content">Transactions</Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Container className="tabpanel-content">
              <Container className="searchTokens">
                <Button
                  className="btn-small"
                  variant="contained"
                  size="small"
                  disabled
                >
                  Most Popular
                </Button>
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
                {" "}
                needs some styling lol <br />
                {JSON.stringify(tokenBalances)}
              </Container>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={2}>
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
                    This address doesn't own any NFTs.
                  </Typography>
                </Container>
              ) : (
                <Container className="display-nfts">{displayNfts}</Container>
              )}
            </Container>
          </TabPanel>
        </Paper>
      </Box>
    );
  } else if (type === "contract") {
    return (
      <Box className="content">
        <Box className="title">
          <Typography variant="h6">Contract: {address}</Typography>
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
              <Tab label="Transactions" />
              <Tab label="Internal transactions" />
              <Tab label="Code" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Container className="tabpanel-content">Outgoing Tx</Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Container className="tabpanel-content">Incoming Tx</Container>
          </TabPanel>
          <TabPanel value={value} index={2}>
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
        </Paper>
      </Box>
    );
  }
};

export default Address;
