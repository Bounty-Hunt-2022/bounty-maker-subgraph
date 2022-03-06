import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Bounty } from "../../generated/schema";

export function getBounty(bountyId: string, block: ethereum.Block): Bounty {
  let bounty = Bounty.load(bountyId);

  if (bounty === null) {
    bounty = new Bounty(bountyId);
    bounty.active = false;
    bounty.rewards = [];
    bounty.uri = "";
    bounty.tokenLimit = BigInt.zero();
    bounty.deadline = BigInt.zero();
    bounty.block = block.number;
    bounty.timestamp = block.timestamp;
    bounty.save();
  }

  return bounty as Bounty;
}
