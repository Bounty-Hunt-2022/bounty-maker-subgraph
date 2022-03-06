import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Winners } from "../../generated/schema";

export function getWinners(
  bountyId: string,
  address: Address,
  block: ethereum.Block
): Winners {
  let winners = Winners.load(`${bountyId}-${address.toHex()}`);

  if (winners === null) {
    winners = new Winners(`${bountyId}-${address.toHex()}`);
    if (address == Address.zero()) {
      winners.block = block.number;
      winners.timestamp = block.timestamp;
      winners.save();
    } else {
      winners.address = address;
      winners.bounty = bountyId;
      winners.reward = BigInt.zero();
      winners.nftUri = "";
      winners.claimed = false;
      winners.block = block.number;
      winners.timestamp = block.timestamp;
      winners.save();
    }
  }

  return winners as Winners;
}
