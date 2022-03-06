import { BigInt } from "@graphprotocol/graph-ts";
import {
  BountyMaker,
  Approval,
  ApprovalForAll,
  BountyCreated,
  Claim,
  ERC20PaymentReleased,
  OwnershipTransferred,
  Transfer,
  WinnersDeclared,
  SetBountyWinnersCall,
} from "../generated/BountyMaker/BountyMaker";
import { getBounty } from "./entities/bounty";
import { getBountyMaker } from "./entities/bountyMaker";
import { getWinners } from "./entities/winners";

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.
  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.adminClaimToken(...)
  // - contract.balanceOf(...)
  // - contract.bountys(...)
  // - contract.claimToken(...)
  // - contract.claimed(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.rewards(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.token(...)
  // - contract.tokenURI(...)
  // - contract.winners(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleBountyCreated(event: BountyCreated): void {
  let id = event.params._bountyId.toString();
  let bounty = getBounty(id, event.block);
  let bountyMaker = getBountyMaker(event.block);
  let bountyMakerContract = BountyMaker.bind(event.address);

  const bountyResult = bountyMakerContract.try_bountys(event.params._bountyId);

  if (!bountyResult.reverted) {
    bounty.uri = bountyResult.value.value0;
    bounty.tokenLimit = bountyResult.value.value1;
    bounty.deadline = bountyResult.value.value3;
  }

  bounty.active = true;
  bounty.block = event.block.number;
  bounty.timestamp = event.block.timestamp;
  bounty.rewards = event.params._rewards;
  bountyMaker.bountyCount = bountyMaker.bountyCount.plus(BigInt.fromI32(1));
  bountyMaker.block = event.block.number;
  bountyMaker.timestamp = event.block.timestamp;
  bounty.save();
}

export function handleClaim(event: Claim): void {
  let id = event.params._bountyId.toString();
  let bounty = getBounty(id, event.block);
  let winners = getWinners(id, event.params._receiver, event.block);
  // winners.reward = winners.reward.plus(event.params._amount);
  winners.claimed = true;
  let bountyMakerContract = BountyMaker.bind(event.address);
  const nftUriResult = bountyMakerContract.try_tokenURI(
    event.params._contractIndex
  );
  const rewardResult = bountyMakerContract.try_rewards(
    id,
    event.params._bountyIndex
  );

  if (!nftUriResult.reverted) {
    winners.nftUri = nftUriResult.value;
  }
  if (!rewardResult.reverted) {
    winners.reward = rewardResult.value;
  }
  bounty.active = false;
  bounty.save();
  winners.save();
}

export function handleERC20PaymentReleased(event: ERC20PaymentReleased): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {}

export function handleWinnersDeclared(event: WinnersDeclared): void {
  let id = event.params._bountyId.toString();
  let bounty = getBounty(id, event.block);
  bounty.active = false;
  bounty.save();
}

export function handleBountyWinners(call: SetBountyWinnersCall): void {
  let id = call.inputs._bountyId.toString();
  let bounty = getBounty(id, call.block);
  let bountyMakerContract = BountyMaker.bind(call.to);

  if (bounty.active === true) {
    const winnersArr = call.inputs._winners;
    for (let i = 0; i < winnersArr.length; i++) {
      let winners = getWinners(id, winnersArr[i], call.block);
      const rewardResult = bountyMakerContract.try_rewards(
        id,
        BigInt.fromI32(i)
      );
      if (!rewardResult.reverted) {
        winners.reward = rewardResult.value;
      }
      winners.claimed = false;
      winners.block = call.block.number;
      winners.timestamp = call.block.timestamp;
      winners.save();
    }
  }
}
