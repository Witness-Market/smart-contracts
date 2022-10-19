import fs from "fs";
import hre from "hardhat";
import { getConfig } from "../configManager";

async function main() {
  const network = await hre.network.name;

  const config = getConfig(network);
  const subgraphNetwork = JSON.parse(loadJSON());

  if (network == "localhost") {
    subgraphNetwork.localhost.TalentLayerID.address =
      config.talentLayerIdAddress;
    subgraphNetwork.localhost.TalentLayerReview.address =
      config.talentLayerReviewAddress;
    subgraphNetwork.localhost.JobRegistry.address = config.jobRegistryAddress;
    subgraphNetwork.localhost.TalentLayerMultipleArbitrableTransaction.address =
      config.talentLayerMultipleArbitrableTransactionAddress;
    subgraphNetwork.localhost.TalentLayerPlatformID.address =
      config.talentLayerPlatformIdAddress;
  }
  if (network == "goerli") {
    subgraphNetwork.goerli.proofOfHumanityAddress.address =
      config.proofOfHumanityAddress;
    subgraphNetwork.goerli.TalentLayerID.address = config.talentLayerIdAddress;
    subgraphNetwork.goerli.TalentLayerReview.address =
      config.talentLayerReviewAddress;
    subgraphNetwork.goerli.JobRegistry.address = config.jobRegistryAddress;
    subgraphNetwork.goerli.TalentLayerMultipleArbitrableTransaction.address =
      config.TalentLayerMultipleArbitrableTransaction;
    subgraphNetwork.localhost.TalentLayerPlatformID.address =
      config.TalentLayerPlatformID;
  }

  saveJSON(subgraphNetwork);
}

function loadJSON() {
  const filename = `${process.env.SUBGRAPH_FOLDER}/networks.json`;
  return fs.existsSync(filename) ? fs.readFileSync(filename).toString() : "{}";
}

function saveJSON(subgraphNetwork: any) {
  const filename = `${process.env.SUBGRAPH_FOLDER}/networks.json`;
  return fs.writeFileSync(filename, JSON.stringify(subgraphNetwork, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});