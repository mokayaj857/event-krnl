<<<<<<< HEAD
# 🎟️ Eventverse.

## 🌍 Overview

Eventverse is a revolutionary blockchain-based ticketing platform engineered to combat fraud and inefficiencies in the event ticketing industry. Leveraging the Avalanche blockchain, our platform empowers event organizers to issue tickets as digital tokens, ensuring secure purchases, effortless resales, and QR-code-based authentication.

## ✨ Key Features,

### 🎟️ Decentralized Ticket Minting & Transfer

- Event organizers can mint unique, tamper-proof tickets with embedded event details.
- Blockchain-backed transparency guarantees authenticity and secure transfers.

### 🤖 AI Assistant

- An intelligent chatbot designed to help users navigate the EventVax platform
- Provides accurate, context-aware answers about ticket purchasing, wallet connections, event creation, and more
- Offers step-by-step guidance for blockchain interactions and NFT ticket management
- Features a beautiful floating UI that's accessible throughout the platform

### 📲 QR Code Verification

- Each ticket is embedded with a unique QR code for instant and tamper-proof validation.
- Eliminates counterfeit tickets and simplifies on-site verification.

### 🔐 Secure Blockchain Transactions

- Powered by Avalanche, enabling fast, transparent, and cost-efficient ticket purchases and resales.
- Immutable transaction records provide peace of mind for buyers and sellers.

### 🔄 Resale Marketplace

- A decentralized marketplace for verified resale, maintaining ticket integrity and fair pricing.
- Automated smart contracts prevent scalping and fraud.

## 🛠️ Tech Stack

### Languages & Frameworks


### Languages & Frameworks
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Blockchain
![Avalanche](https://img.shields.io/badge/Avalanche-E84142?style=for-the-badge&logo=avalanche&logoColor=white)
![Web3.js](https://img.shields.io/badge/Web3.js-F16822?style=for-the-badge&logo=web3.js&logoColor=white)

### Development Tools
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=OpenZeppelin&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)




## 🚀 Getting Started

### Prerequisites

1. **Install Node.js:**

   ```bash
   # For Windows: Download and install from https://nodejs.org/
   
   # For Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm
   
   # For macOS wicth Homebrew
   brew install node
   ```
   Verify installation with: `node --version` and `npm --version`

2. **Clone the repository:**

   ```bash
   git clone https://github.com/mokayaj857/eventvax.git

   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Compile smart contracts:**

   ```bash
   npx hardhat compile
   ```

4. **Configure Avalanche network:**
   Edit `hardhat.config.js` to include Avalanche network details under the `networks` section.

5. **Deploy contracts:**

   ```bash
   npx hardhat run scripts/deploy.js --network avalanche
   ```

6. **Run the application locally:**

   ```bash
   # First, install and run the backend server
   cd server
   npm install
   npm run dev
   
   # In a new terminal, run the frontend
   cd eventvax
   npm install
   npm run dev
   ```

> 💡 Don't forget to update your contract address in the configuration files!

## 👥 The Team

| Name                | Role                 | Contact                                      |
| ------------------- | -------------------- | -------------------------------------------- |
| Williams Ochieng    | Smart Contract Dev   | [williams@example.com](mailto:williams@example.com) |
| Joseph Okumu Otieno | Full-stack Engineer  | [jokumu25@gmail.com](mailto:jokumu25@gmail.com) |
| John Mokaya         | Frontend Developer   | [mokayaj857@gmail.com](mailto:mokayaj857@gmail.com) |
| Phillip Ochieng    | Frontend Developer    | [oumaphilip01@gmail.com](mailto:oumaphilip01@gmail.com) |
| Ouma Ouma         | Full-Stack Enginee   | [ouma.godwin10@gmail.com](mailto:ouma.godwin10@gmail.com) |


### 🌐 Waitlist Landing Page Integration

<img width="945" alt="Screenshot 2025-01-21 151558" src="https://github.com/user-attachments/assets/36aff1b1-6c2f-476d-b0ea-8729c0a52148" />


#### Key Deliverables:

1. **Landing Page Design**

   <img width="948" alt="Screenshot 2025-01-21 151517" src="https://github.com/user-attachments/assets/786b0fb1-92c5-4433-89bd-6c7282ea8e69" />

2. **Tickets collection**
   <img width="950" alt="Screenshot 2025-01-21 161518" src="https://github.com/user-attachments/assets/cd58022e-d42d-4327-b3f6-ec45d496d4d8" />
   
3. **Ticket sales**

 <img width="960" alt="Screenshot 2025-01-21 151643" src="https://github.com/user-attachments/assets/a222522c-71fc-47df-b6f0-a775ed58cd11" />

4. **Ticket Minting**
   <img width="959" alt="Screenshot 2025-01-21 151623" src="https://github.com/user-attachments/assets/f773d40b-760f-4021-aaf0-0ea4d87e677e" />

4. **QR code Intergration**
   <img width="947" alt="Screenshot 2025-01-21 162251" src="https://github.com/user-attachments/assets/99520049-8a10-4ae3-b538-2e6b0bc5df7b" />


5. **Go Live!**

   - Promote the page across social media and mailing lists.
     



## 🎥 Project Video Demo

<p align="center">
  <a href="https://drive.google.com/file/d/1Z5Q1POLNw9g6Vq8ph7jJq1FduJROfza0/view?usp=sharing" target="_blank">
    <img src="https://img.icons8.com/clouds/500/video-playlist.png" alt="Watch Project Video" width="60%" />
  </a>
</p>

📽️ **Click the image above to watch the full project demo hosted on Google Drive.**






## ⛰️ Avalanche Integration

### 🚀 Why Avalanche?

- **Speed & Efficiency:** Lightning-fast finality for instant ticket transfers within 2 seconds.
- **Low Costs:** Affordable transactions for users and event organizers.
- **💰 Cost Efficiency**
   - Minimal transaction fees
   - Economical for both users and operators

### 🔗 Deployment Strategy

- Our smart contracts are deployed on Avalanche's C-Chain to facilitate secure ticket operations.
- Robust deployment pipeline via Hardhat ensures reliability.

## 🔮 Vision.

Eventverse is redefining event ticketing by combining blockchain security with intuitive user experiences. Stay tuned for exciting updates and new features as we shape the future of event access!

## 📊 Project Status
![Development Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge)
![Test Coverage](https://img.shields.io/badge/Coverage-85%25-green?style=for-the-badge)

=======
# Sample Hardhat 3 Beta Project (`node:test` and `viem`)

This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html), the new Node.js native test runner, and [`viem`](https://viem.sh/).
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
>>>>>>> 8197ecfa39a3a8a6d9db57cf6a3547062f3d3577
# Sample Hardhat 3 Beta Project (`node:test` and `viem`)

This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html), the new Node.js native test runner, and [`viem`](https://viem.sh/).
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
