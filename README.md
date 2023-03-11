# Ethereum Block Explorer

Week 3 project submission for the Alchemy University Blockchain Developer Bootcamp.

## Project Description

Functionality:

- display the latest blocks with transactions
- user can search for blocks by looking up the block number or hash
- user can look up completed transactions by entering the transaction hash
- explore addresses by looking up the address or ENS name
- show NFTs owned by an address
- display current gas price

## Demo

## Built with

- [Next.js](https://nextjs.org/)
- Material UI
- The [Alchemy SDK and Enhanced APIs](https://docs.alchemy.com/reference/api-overview)

## Run locally

After cloning this repo,

- cd into the base directory: `cd block-explorer`
- Run `npm install` to install all the depedencies
- Create a `.env` file by running `touch .env`
- Sign up for a free [Alchemy API key] (https://alchemy.com/?r=DU0MzQ2NjAxNzY4N) and copypaste this line into your `.env` file: `ALCHEMY_API_KEY="<-- enter your api key -->"`, replacing `<-- enter your api key -->` with your API key
- Run `npm run dev` to start the application and open [http://localhost:3000](http://localhost:3000) in your browser
