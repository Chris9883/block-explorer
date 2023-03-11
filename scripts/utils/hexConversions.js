import { Utils } from "alchemy-sdk";

function intToUnpaddedHex(number) {
  return Utils.hexStripZeros(Utils.hexlify(parseInt(number)));
}

export { intToUnpaddedHex };
