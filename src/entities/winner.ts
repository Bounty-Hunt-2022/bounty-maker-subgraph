import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Win } from "../../generated/schema";

export function getWinner(
  bountyId: string,
  address: Address,
  block: ethereum.Block
): Win {
  let winner = Win.load(`${bountyId}-${address.toHex()}`);

  if (winner === null) {
    winner = new Win(`${bountyId}-${address.toHex()}`);
    if (address == Address.zero()) {
      winner.block = block.number;
      winner.timestamp = block.timestamp;
      winner.save();
    } else {
      winner.hunter = address.toHexString();
      winner.bounty = bountyId;
      winner.reward = BigInt.zero();
      winner.nftUri = "";
      winner.claimed = false;
      winner.block = block.number;
      winner.timestamp = block.timestamp;
      winner.save();
    }
  }

  return winner as Win;
}
