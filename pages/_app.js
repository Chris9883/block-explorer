import "@/styles/globals.css";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import ChainInfo from "@/components/ChainInfo";
import { createTheme, ThemeProvider } from "@mui/material";
import { getCurrentBlockNumber, getGasPrice } from "@/scripts/alchemyApi";

export default function App({ Component, pageProps }) {
  const [userInput, setUserInput] = useState();
  const [currentBlock, setCurrentBlock] = useState();
  const [gasPrice, setGasPrice] = useState();

  useEffect(() => {
    async function fetchData() {
      let [blockNumber, timestamp] = await getCurrentBlockNumber();
      setCurrentBlock(blockNumber);
      let gasPrice = await getGasPrice();
      if (gasPrice) {
        setGasPrice(gasPrice);
      }
    }
    fetchData();
    // refetch every 300 seconds --> should be every 1 second to get realTime data
    const interval = setInterval(() => {
      fetchData();
    }, 300000);
  }, []);

  // create custumized theme
  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#1c3545",
        contrastText: "#fff",
      },
      secondary: {
        main: "#f7882f",
        contrastText: "#fff",
      },
      accent: {
        main: "#F7C331",
        contrastText: "#f7882f",
      },
      error: {
        main: "#d32f2f",
        contrastText: "#fff",
      },
      success: {
        main: "#00ab41",
        contrastText: "#fff",
      },
      info: {
        main: "#007fa7",
        contrastText: "#fff",
      },
    },
    typography: {
      accent: {
        color: "F7C331",
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Head>
        <title>Ethereum Block Explorer</title>
        <meta
          name="description"
          content="View transaction and block details and browse addresses on Ethereum"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/browsericon.png" />
      </Head>
      <Header
        userInput={userInput}
        setUserInput={setUserInput}
        currentBlock={currentBlock}
      />
      {<ChainInfo currentBlock={currentBlock} gasPrice={gasPrice} />}
      <main>
        <Component {...pageProps} currentBlock={currentBlock} />
      </main>
    </ThemeProvider>
  );
}
