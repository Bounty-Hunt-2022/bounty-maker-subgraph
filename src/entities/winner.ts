import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Winner } from "../../generated/schema";

export function getWinner(
  bountyId: string,
  address: Address,
  block: ethereum.Block
): Winner {
  let winner = Winner.load(`${bountyId}-${address.toHex()}`);

  if (winner === null) {
    winner = new Winner(`${bountyId}-${address.toHex()}`);
    if (address == Address.zero()) {
      winner.block = block.number;
      winner.timestamp = block.timestamp;
      winner.save();
    } else {
      winner.address = address;
      winner.bounty = bountyId;
      winner.reward = BigInt.zero();
      winner.nftUri = "";
      winner.claimed = false;
      winner.block = block.number;
      winner.timestamp = block.timestamp;
      winner.save();
    }
  }

  return winner as Winner;
}
