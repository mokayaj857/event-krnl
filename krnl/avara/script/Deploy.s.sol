// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {AvaraCore} from "../contracts/avara.sol";

contract DeployScript is Script {
    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Get KRNL signer or use deployer as fallback
        address krnlSigner;
        try vm.envAddress("KRNL_SIGNER") returns (address signer) {
            krnlSigner = signer;
        } catch {
            krnlSigner = deployer;
            console.log("KRNL_SIGNER not set, using deployer address");
        }
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying AvaraCore...");
        console.log("Deployer:", deployer);
        console.log("KRNL Signer:", krnlSigner);
        
        AvaraCore avaraCore = new AvaraCore(krnlSigner);
        
        address poapNFT = address(avaraCore.poaps());
        address ticketNFT = address(avaraCore.tickets());
        
        console.log("\n=== Deployment Complete ===");
        console.log("AvaraCore:", address(avaraCore));
        console.log("POAPNFT:", poapNFT);
        console.log("TicketNFT:", ticketNFT);
        console.log("KRNL Signer:", krnlSigner);
        
        vm.stopBroadcast();
    }
}

