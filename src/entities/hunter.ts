import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Hunter } from "../../generated/schema";

export function getHunter(
  address: Address,
  block: ethereum.Block
): Hunter {
  let hunter = Hunter.load(address.toHexString());

  if (hunter === null) {
    hunter = new Hunter(address.toHexString());
    hunter.block = block.number;
    hunter.timestamp = block.timestamp;
    hunter.rewardWon=BigInt.zero();
    hunter.winCount=BigInt.zero();
    hunter.rewardClaimed=BigInt.zero();
    hunter.winClaimed=BigInt.zero();
    hunter.save();
  }

  return hunter as Hunter;
}