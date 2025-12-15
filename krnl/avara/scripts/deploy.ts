import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy POAPNFT (soulbound = true)
  const POAPNFT = await ethers.getContractFactory("POAPNFT");
  const poapNFT = await POAPNFT.deploy(true);
  await poapNFT.deployed();
  console.log("POAPNFT deployed to:", poapNFT.address);

  // Deploy TicketNFT
  const TicketNFT = await ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy();
  await ticketNFT.deployed();
  console.log("TicketNFT deployed to:", ticketNFT.address);

  // Deploy AvaraCore with the deployed NFT contract addresses
  const AvaraCore = await ethers.getContractFactory("AvaraCore");
  const avaraCore = await AvaraCore.deploy(
    poapNFT.address,
    ticketNFT.address,
    process.env.KRNL_SIGNER || deployer.address // Use KRNL_SIGNER from .env or fallback to deployer
  );
  await avaraCore.deployed();
  console.log("AvaraCore deployed to:", avaraCore.address);

  // Transfer ownership of NFT contracts to AvaraCore
  console.log("Transferring ownership of NFT contracts to AvaraCore...");
  await poapNFT.transferOwnership(avaraCore.address);
  await ticketNFT.transferOwnership(avaraCore.address);
  console.log("Ownership transferred successfully!");

  // Verify ownership
  console.log("Verifying ownership...");
  console.log("POAPNFT owner:", await poapNFT.owner());
  console.log("TicketNFT owner:", await ticketNFT.owner());
  
  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    deployer: deployer.address,
    contracts: {
      AvaraCore: avaraCore.address,
      POAPNFT: poapNFT.address,
      TicketNFT: ticketNFT.address
    },
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment complete!");
  console.log("\nDeployment Info:", JSON.stringify(deploymentInfo, null, 2));
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
