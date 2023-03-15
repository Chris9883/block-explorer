import Link from "next/link";
import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getLatestBlocks } from "@/scripts/alchemyApi";
import { displayUnix } from "@/scripts/utils/formatter";

export default function Home({ currentBlock }) {
  const [latestBlocks, setLatestBlocks] = useState();
  let displayNumberOfBlocks = 10;

  let skeletons = [];
  for (let i = 0; i < displayNumberOfBlocks; i++) {
    skeletons.push(
      <Skeleton
        variant="rounded"
        width={810}
        height={62}
        className="block-skeleton"
      />
    );
  }

  useEffect(() => {
    async function fetchData() {
      getLatestBlocks(currentBlock, setLatestBlocks, displayNumberOfBlocks);
    }
    if (currentBlock) {
      fetchData();
    }
  }, [currentBlock, displayNumberOfBlocks]);

  return (
    <>
      <Box mt={2} className="content">
        <Typography variant="h6">Latest blocks</Typography>

        {latestBlocks ? (
          <Box>
            {latestBlocks.map((block) => {
              return (
                <Paper
                  elevation={3}
                  className="block-container"
                  key={block.number}
                >
                  <Grid container>
                    <Grid item xs={3}>
                      {" "}
                      <Link href={`/block/${block.number}`}>
                        <Typography variant="body1">{block.number}</Typography>
                      </Link>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body1" xs={9}>
                        Fee Recipient:{" "}
                        <Link href={`/address/${block.feeRecipient}`}>
                          {block.feeRecipient}
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className="mobile-hidden">
                      <Typography variant="body1">
                        {displayUnix(block.timestamp)}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body1">
                        {block.numTransactions} Transactions
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <Box>{skeletons}</Box>
        )}
      </Box>
    </>
  );
}
