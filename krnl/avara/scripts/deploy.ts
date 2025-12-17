import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get KRNL signer address from env or use deployer as fallback
  const krnlSigner = process.env.KRNL_SIGNER || deployer.address;
  console.log("KRNL Signer address:", krnlSigner);

  // Deploy AvaraCore - it will deploy POAPNFT and TicketNFT internally
  console.log("\nDeploying AvaraCore (this will also deploy POAPNFT and TicketNFT)...");
  const AvaraCore = await ethers.getContractFactory("AvaraCore");
  const avaraCore = await AvaraCore.deploy(krnlSigner);
  await avaraCore.deployed();
  console.log("AvaraCore deployed to:", avaraCore.address);

  // Get the addresses of the deployed NFT contracts from AvaraCore
  const poapNFTAddress = await avaraCore.poaps();
  const ticketNFTAddress = await avaraCore.tickets();
  
  console.log("POAPNFT deployed to:", poapNFTAddress);
  console.log("TicketNFT deployed to:", ticketNFTAddress);

  // Verify ownership (should already be set by constructor)
  console.log("\nVerifying ownership...");
  const poapNFT = await ethers.getContractAt("POAPNFT", poapNFTAddress);
  const ticketNFT = await ethers.getContractAt("TicketNFT", ticketNFTAddress);
  
  console.log("POAPNFT owner:", await poapNFT.owner());
  console.log("TicketNFT owner:", await ticketNFT.owner());
  console.log("KRNL Signer:", await avaraCore.krnlSigner());
  
  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    contracts: {
      AvaraCore: avaraCore.address,
      POAPNFT: poapNFTAddress,
      TicketNFT: ticketNFTAddress,
      KRNL_SIGNER: krnlSigner
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n✅ Deployment complete!");
  console.log("\n📋 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
