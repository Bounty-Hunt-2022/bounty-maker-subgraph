import { BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { BountyMaker } from "../../generated/schema";

export function getBountyMaker(block: ethereum.Block): BountyMaker{
    let bountyMaker=BountyMaker.load(dataSource.address().toHex());

    if(bountyMaker===null){
        bountyMaker=new BountyMaker(dataSource.address().toHex());
        bountyMaker.bountyCount=BigInt.zero();
        bountyMaker.block=block.number;
        bountyMaker.timestamp=block.timestamp;
        bountyMaker.save();
    }

    return bountyMaker as BountyMaker;
}