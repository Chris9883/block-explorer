import { Alchemy, Network, Utils } from "alchemy-sdk";

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const settings = {
  apiKey: apiKey,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

async function getLatestBlocks(currentBlock, setLatestBlocks, amount) {
  try {
    let latestBlocks = [];
    for (
      let i = parseInt(currentBlock);
      i > parseInt(currentBlock - amount);
      i--
    ) {
      const result = await alchemy.core.getBlock(i);
      let block = {};
      block.number = result.number;
      block.feeRecipient = result.miner;
      block.timestamp = result.timestamp;
      block.numTransactions = result.transactions.length;
      latestBlocks.push(block);
    }
    setLatestBlocks(latestBlocks);
    return true;
  } catch (e) {
    if (e.message.toLowercase.includes("servererror")) {
      alert("Server error - can not display latest blocks");
    }
    console.error(e);
    return false;
  }
}

async function getAccountDetails(
  address,
  setBalance,
  setType,
  setCode,
  setOutgoing,
  setIncoming,
  setLoading
) {
  const amount = Utils.hexlify(20);
  try {
    setLoading(true);
    const balance = await alchemy.core.getBalance(address);
    setBalance(Utils.formatUnits(balance, "ether"));
    const code = await alchemy.core.getCode(address);
    const outgoingTx = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      order: "desc",
      maxCount: amount,
    });
    const incomingTx = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      order: "desc",
      maxCount: amount,
    });
    if (code == "0x") {
      setType("eoa");
    } else {
      setType("contract");
      setCode(code);
    }
    if (outgoingTx) {
      let outgoings = [];
      for (const tx of outgoingTx.transfers) {
        let outgoing = {};
        outgoing.from = tx.from;
        outgoing.to = tx.to;
        outgoing.type = tx.category;
        outgoing.asset = tx.asset;
        outgoing.blockNumber = parseInt(tx.blockNum);
        outgoing.txHash = tx.hash;
        outgoing.value = tx.value;
        outgoings.push(outgoing);
      }
      setOutgoing(outgoings);
    }
    if (incomingTx) {
      let incomings = [];
      for (const tx of incomingTx.transfers) {
        let incoming = {};
        incoming.from = tx.from;
        incoming.to = tx.to;
        incoming.type = tx.category;
        incoming.asset = tx.asset;
        incoming.blockNumber = parseInt(tx.blockNum);
        incoming.txHash = tx.hash;
        incoming.value = tx.value;
        incomings.push(incoming);
      }
      setIncoming(incomings);
      setLoading(false);
    }
  } catch (e) {
    handleError(e, setLoading);
  }
}

async function getTransactionDetails(
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
) {
  if (txHash) {
    try {
      const data = await alchemy.core.getTransaction(txHash);
      if (!data) {
        return false;
      } else {
        // can also get logs from tx receipt
        const txReceipt = await alchemy.core.getTransactionReceipt(txHash);

        setConfirmations(data.confirmations);
        setBlockNumber(data.blockNumber);
        const blockInfo = await alchemy.core.getBlock(
          parseInt(data.blockNumber)
        );
        setIndex(data.transactionIndex);
        setSender(data.from);
        setRecipient(data.to);
        setValue(Utils.formatUnits(data.value, "ether"));
        setData(data.data);
        setCreates(data.creates);
        setBaseFee(
          Utils.formatUnits(parseInt(blockInfo.baseFeePerGas), "gwei")
        );
        setGasPrice(Utils.formatUnits(parseInt(data.gasPrice), "gwei"));
        setGasLimit(parseInt(data.gasLimit));
        setGasUsed(parseInt(txReceipt.gasUsed));
        let maxFeePerGas = parseInt(data.maxFeePerGas);
        if (maxFeePerGas == 0) {
          setMaxFeePerGas(0);
        } else {
          setMaxFeePerGas(Utils.formatUnits(maxFeePerGas, "gwei"));
        }
        let maxPrio = parseInt(data.maxPriorityFeePerGas);
        if (maxPrio == 0) {
          setMaxPriorityFeePerGas(0);
        } else {
          setMaxPriorityFeePerGas(Utils.formatUnits(maxPrio, "gwei"));
        }

        setNonce(data.nonce);
        setR(data.r);
        setS(data.s);
        setV(data.v);
        setType(data.type);
        return true;
      }
    } catch (e) {
      if (e.message.includes("invalid block hash or block tag ")) {
        return false;
      } else {
        handleError(e);
        return true;
      }
    }
  }
}

async function getBlockDetails(
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
) {
  if (blockNumberOrHash) {
    let input = blockNumberOrHash;
    if (!input.startsWith("0x")) {
      input = parseInt(blockNumberOrHash);
    }
    try {
      // status, blockreward, totalDifficulty, Blocksize, BurntFees, StateRoot, contractInternaltx, BaseFeePerGas missing
      const blockInfo = await alchemy.core.getBlock(input);
      if (!blockInfo) {
        return false;
      }
      setBlockNumber(blockInfo.number);
      setBlockhash(blockInfo.hash);
      setTimestamp(blockInfo.timestamp);
      setTransactions(blockInfo.transactions);
      setGasUsed(parseInt(blockInfo.gasUsed));
      setGasLimit(parseInt(blockInfo.gasLimit));
      // unhex?
      setExtraData(blockInfo.extraData.toString());
      setParentHash(blockInfo.parentHash);
      setFeeRecipient(blockInfo.miner);
      return true;
    } catch (e) {
      handleError(e);
      return true;
    }
  }
}

async function resolveEnsName(ens) {
  try {
    let address = await alchemy.core.resolveName(ens);
    return address;
  } catch (e) {
    handleError(e);
  }
}

async function getCurrentBlockNumber() {
  try {
    let currentBlock = await alchemy.core.getBlock();
    return [currentBlock.number, currentBlock.timestamp];
  } catch (e) {
    handleError(e);
  }
}

async function getGasPrice() {
  try {
    let gasPrice = await alchemy.core.getGasPrice();
    return Math.round(Utils.formatUnits(parseInt(gasPrice), "gwei"));
  } catch (e) {
    handleError(e);
  }
}

async function getTokens(address, setTokenBalances, setTotalCount) {
  try {
    const data = await alchemy.core.getTokenBalances(address);
    const tokens = [];

    if (data) {
      // Remove tokens with zero balance
      const nonZeroBalances = data.tokenBalances.filter((token) => {
        return parseInt(token.tokenBalance) != "0";
      });
      setTotalCount(nonZeroBalances);
      for (const tokenBalance of nonZeroBalances) {
        const metadata = await alchemy.core.getTokenMetadata(
          tokenBalance.contractAddress
        );
        let token = {};
        token.address = tokenBalance.contractAddress;
        token.balance = parseInt(tokenBalance.tokenBalance);
        if (metadata) {
          token.logo = metadata.logo;
          token.name = metadata.name;
          token.decimals = metadata.decimals;
          token.symbol = metadata.symbol;
        }
        tokens.push(token);
      }
    }
    console.log("tokens", tokens);
    setTokenBalances(tokens);
  } catch (e) {
    handleError(e);
  }
}

// implement
async function getTokensByContract(
  address,
  contractAddress,
  setTokenBalances,
  setLoading
) {
  try {
    const data = await alchemy.core.getTokenBalances(address, [
      contractAddress,
    ]);
    console.log("token for address data", data);
    /*
    if (data) {
      // Remove tokens with zero balance
      const nonZeroBalances = data.tokenBalances.filter((token) => {
        return parseInt(token.tokenBalance) != "0";
      });
      for (const tokenBalance of nonZeroBalances) {
        const metadata = await alchemy.core.getTokenMetadata(
          tokenBalance.contractAddress
        );
        let token = {};
        token.address = tokenBalance.contractAddress;
        token.balance = parseInt(tokenBalance.tokenBalance);
        if (metadata) {
          token.logo = metadata.logo;
          token.name = metadata.name;
          token.decimals = metadata.decimals;
          token.symbol = metadata.symbol;
        }
        tokens.push(token);
      }
    }
    console.log("tokens", tokens);
    setTokenBalances(tokens);*/
  } catch (e) {
    handleError(e);
  }
}

async function getNfts(address, setNfts, setTotalCount) {
  try {
    let data = await alchemy.nft.getNftsForOwner(address, {
      excludeFilters: ["SPAM"],
    });
    let nfts = [];
    if (data) {
      setTotalCount(data.totalCount);
      for (let ownedNft of data.ownedNfts) {
        let nft = {};
        nft.name = ownedNft.contract.name;
        nft.symbol = ownedNft.contract.symbol;
        nft.address = ownedNft.contract.address;
        nft.image = "";
        nft.image = ownedNft.media[0]?.gateway;
        nft.tokenId = ownedNft.tokenId;
        nfts.push(nft);
      }
    }
    setNfts(nfts);
  } catch (e) {
    handleError(e);
  }
}

async function getNftsByContract(
  address,
  contractAddress,
  setNfts,
  setTotalCount,
  setLoading
) {
  try {
    setLoading(true);
    let data = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [contractAddress],
    });
    let nfts = [];
    if (data) {
      setTotalCount(data.totalCount);
      for (let ownedNft of data.ownedNfts) {
        let nft = {};
        nft.name = ownedNft.contract.name;
        nft.symbol = ownedNft.contract.symbol;
        nft.address = ownedNft.contract.address;
        nft.image = "";
        nft.image = ownedNft.media[0]?.gateway;
        nft.tokenId = ownedNft.tokenId;
        nfts.push(nft);
      }
    }
    setNfts(nfts);
    setLoading(false);
  } catch (e) {
    handleError(e, setLoading);
  }
}

function handleError(e, setLoading) {
  if (setLoading) {
    setLoading(false);
  }
  // if server error don't log / only alert server error
  console.error(e);
  alert(e);
}

export {
  getLatestBlocks,
  getAccountDetails,
  getTransactionDetails,
  getBlockDetails,
  resolveEnsName,
  getCurrentBlockNumber,
  getGasPrice,
  getTokens,
  getNfts,
  getNftsByContract,
  getTokensByContract,
};
