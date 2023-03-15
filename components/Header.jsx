import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { resolveEnsName } from "@/scripts/alchemyApi";
import {
  styled,
  alpha,
  AppBar,
  Button,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// search bar styling
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  minWidth: "30vw",
  width: "100%",
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    minWidth: "27vw",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

// Header component
export default function Header({ currentBlock }) {
  const router = useRouter();
  const [userInput, setUserInput] = useState();

  async function search(e) {
    e.preventDefault();
    if (userInput) {
      let trimmedInput = userInput.trim(); // remove whitespace characters at beginning + end

      // evaluate user Input and direct to address/tx/block...
      if (trimmedInput.slice(-4) == ".eth") {
        let address = await resolveEnsName(trimmedInput);
        if (address) {
          router.replace(`/address/${address}`);
        } else {
          if (router.pathname != "/_error") {
            router.replace("/error");
          }
        }
      } else if (trimmedInput.length == 42 && trimmedInput.startsWith("0x")) {
        router.replace(`/address/${trimmedInput}`);
      } else if (trimmedInput.length == 66 && trimmedInput.startsWith("0x")) {
        console.log("you entered a tx or block hash");
        router.replace(`/tx/${trimmedInput}`);
      } else if (
        /^\d+$/.test(trimmedInput) && // user input only contains digits
        parseInt(trimmedInput) >= 0 &&
        parseInt(userInput) <= currentBlock
      ) {
        router.replace(`/block/${trimmedInput}`);
      } else {
        if (router.pathname != "/_error") {
          router.replace("/error");
        }
      }
      setUserInput(""); // reset
    }
  }
  return (
    <header>
      <AppBar color="primary" position="sticky">
        <Toolbar variant="regular" sx={{ justifyContent: "center" }}>
          <Link href="/" className="logo">
            <Typography variant="body1" color="inherit" component="div">
              Ethereum Block Explorer
            </Typography>
          </Link>
          <form onSubmit={search}>
            <Search className="user-input">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                id="search"
                placeholder="Block number, Tx hash or Address"
                inputProps={{ "aria-label": "search" }}
                value={userInput}
                onChange={(e) => {
                  e.preventDefault();
                  setUserInput(e.target.value);
                }}
              />
              <Button
                className="search-button"
                variant="text"
                type="submit"
                color="primary"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                Search
              </Button>
            </Search>
          </form>
        </Toolbar>
      </AppBar>
    </header>
  );
}
