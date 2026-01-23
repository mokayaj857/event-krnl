

---

# 🎟️ Avara

**Modular Decentralized Event Ticketing & Attendance Infrastructure**

---

## 🌍 Overview

**Avara** is a modular, decentralized event ticketing and attendance verification platform built on **KRNL**.

It addresses critical challenges in event management—ticket fraud, fake attendance claims, opaque resale markets, and limited accessibility—by transforming tickets into **verifiable NFT assets** and attendance into **on-chain POAP-style credentials**.

Powered by **KRNL’s decentralized orchestration layer**, Avara securely connects blockchain logic with real-world systems such as **QR scanners, USSD, and mobile money**, enabling trustless, transparent, and inclusive event participation.

---

## ✨ Key Features

### 🎟️ Modular NFT Ticketing

**(KRNL Registry Kernel)**

* Event organizers mint cryptographically verifiable NFT tickets.
* All ticket actions (minting, transfers, scanning) are signed and validated through KRNL.
* End-to-end provenance tracking prevents duplication, counterfeiting, and unauthorized transfers.

---

### 📍 Attendance & POAP Verification

**(KRNL Attendance Kernel)**

* Secure on-site check-ins via QR codes or reference codes.
* POAP-style attendance badges are minted only after verified check-ins.
* Attendance proofs are tamper-proof, cryptographically verified, and stored on-chain.

---

### 📲 USSD Access

**(Web2 → Web3 Bridge)**

* Users can browse events and purchase tickets using USSD on basic feature phones.
* Mobile money payments automatically trigger on-chain ticket minting.
* Enables participation without smartphones, wallets, or internet access.

---

### 🔄 Programmable Resale Marketplace

**(KRNL Marketplace Kernel)**

* Transparent primary and secondary ticket sales.
* Organizer-defined resale rules (price caps, transfer limits).
* Anti-bot and anti-scalping enforcement via KRNL’s programmable logic.

---

### 🧠 Reputation & Loyalty

**(KRNL Reputation Kernel)**

* On-chain attendee reputation built from verified attendance history.
* Unlocks perks such as early access, exclusive drops, and VIP tiers.
* Fraud and anomaly detection powered through KRNL’s AI access layer.

---

## 🛠️ Tech Stack

### Languages & Frameworks

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge\&logo=solidity\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)

### Blockchain & Infrastructure

![KRNL](https://img.shields.io/badge/KRNL-Decentralized_Orchestration-blue?style=for-the-badge)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge\&logo=hardhat\&logoColor=black)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge\&logo=OpenZeppelin\&logoColor=white)

### Integrations

* QR Code Scanning Systems
* USSD & Mobile Money APIs
* KRNL Secure API Bridge

---

## 🚀 Getting Started

### Prerequisites

* Node.js ≥ 18
* npm or yarn

### Installation

```bash
\https://github.com/mokayaj857/event-krnl.git
cd event-vax
npm install
```

### Compile Smart Contracts

```bash
npx hardhat compile
```

### Deploy (KRNL-compatible networks)

```bash
npx hardhat run scripts/deploy.js --network <network>
```

> 💡 After deployment, initialize the system by deploying the Ticket and POAP kernels via the core contract.

---

## 👥 Team

| Name            | Role                          |
| --------------- | ----------------------------- |
| Irene Nditi     | Blockchain Auditor & Security |
| Celion Ligalamu | Project Manager & Research    |
| Joe Okumu       | Marketing & Community         |
| John Mokaya     | Frontend & Web3 Integration   |

---

## 📦 Key Deliverables

### 1. Landing Page

<img width="948" src="https://github.com/user-attachments/assets/786b0fb1-92c5-4433-89bd-6c7282ea8e69" />

### 2. Ticket Collection

<img width="950" src="https://github.com/user-attachments/assets/cd58022e-d42d-4327-b3f6-ec45d496d4d8" />

### 3. Ticket Sales Flow

<img width="960" src="https://github.com/user-attachments/assets/a222522c-71fc-47df-b6f0-a775ed58cd11" />

### 4. Ticket Minting

<img width="959" src="https://github.com/user-attachments/assets/f773d40b-760f-4021-aaf0-0ea4d87e677e" />

### 5. QR Code Verification

<img width="947" src="https://github.com/user-attachments/assets/99520049-8a10-4ae3-b538-2e6b0bc5df7b" />

---

## 🎥 Project Demo

<p align="center">
  <a href="https://www.youtube.com/playlist?list=PLKw819e6--6wuT4hH4dJPO4ckFmUeyure" target="_blank">
    <img src="https://img.icons8.com/clouds/500/video-playlist.png" alt="Watch Project Demo" width="60%" />
  </a>
</p>

---

## 🧩 Why KRNL?

Avara leverages KRNL to:

* Orchestrate ticketing, attendance, and resale logic modularly
* Securely integrate off-chain systems through trusted APIs
* Enable cross-chain extensibility and future upgrades
* Provide decentralized verification for real-world actions

KRNL enables Avara to function as **plug-and-play event infrastructure** for conferences, concerts, universities, and community events.

---
# KRNL Integration (Avara) 
##  Where KRNL is used (exact locations)

### A) KRNL SDK usage (Frontend)

**Directory:** `event-vax/krnl/hello-krnl/frontend/`

#### “SDK is used here”

- **KRNL Provider wiring (SDK entrypoint)**: `hello-krnl/frontend/src/App.tsx`
  - Wraps the app with `KRNLProvider` from `@krnl-dev/sdk-react-7702`
- **KRNL config**: `hello-krnl/frontend/src/lib/krnl.ts`
  - Builds config via `createConfig(...)` using:
    - `VITE_KRNL_NODE_URL`
    - `VITE_DELEGATED_ACCOUNT_ADDRESS`
    - `VITE_PRIVY_APP_ID`
    - `VITE_RPC_URL`
- **KRNL SDK hook usage**: `hello-krnl/frontend/src/hooks/useTestScenario.ts`
  - Calls `useKRNL()` / `useNodeConfig()` and executes workflows via `executeWorkflowFromTemplate(...)`

**Avara kernel hooks & UI (implemented inside the demo app):**
- **Ticket Kernel**:
  - Hook: `hello-krnl/frontend/src/hooks/kernels/useTicketKernel.ts`
  - UI: `hello-krnl/frontend/src/components/kernels/TicketKernelCard.tsx`
- **Attendance & POAP Kernel**:
  - Hook: `hello-krnl/frontend/src/hooks/kernels/useAttendanceKernel.ts`
  - UI: `hello-krnl/frontend/src/components/kernels/AttendanceKernelCard.tsx`
- **Marketplace Kernel**:
  - Hook: `hello-krnl/frontend/src/hooks/kernels/useMarketplaceKernel.ts`
  - UI: `hello-krnl/frontend/src/components/kernels/MarketplaceKernelCard.tsx`
- **Reputation Kernel**:
  - Hook: `hello-krnl/frontend/src/hooks/kernels/useReputationKernel.ts`
  - UI: `hello-krnl/frontend/src/components/kernels/ReputationKernelCard.tsx`

**Kernel UI is surfaced in**: `hello-krnl/frontend/src/pages/Dashboard.tsx` (section “Avara KRNL Kernels”).

---

### B) KRNL integration in contracts (On-chain verification)

**Directory:** `event-vax/krnl/avara/contracts/`

####  “Contracts enforce KRNL-signed proofs here”

- **KRNL signer and signature verification**: `avara/contracts/avara.sol`
  - Stores `krnlSigner` on-chain
  - Verifies signatures via `_verifyKrnlSignature(...)` (ECDSA recover)
  - Gates critical actions:
    - `mintTicketWithKrnl(...)` (**Ticket Kernel**)
    - `checkInAndMintPOAP(...)` (**Attendance & POAP Kernel**)
  - Replay protection via `usedProof`
  - Marketplace + reputation logic live in the same contract (listing rules, resale caps, reputation increments)

> Important: Solidity contracts do not “use the KRNL SDK” directly. The contract-side integration is implemented as **signature verification + trusted KRNL signer address**.

---

##  Four-kernel map (Avara ↔ KRNL)

This repo models your architecture as four composable kernels:

- ** Ticket Kernel (Registry Kernel Extension)**  
  KRNL-signed mint proof → `mintTicketWithKrnl(...)` in `avara.sol`
- **Attendance & POAP Kernel (Custom Kernel)**  
  KRNL-signed check-in proof → `checkInAndMintPOAP(...)` in `avara.sol`
- ** Marketplace Kernel**  
  Rules + resale enforcement → `listTicket(...)`, `buyTicket(...)`, `setEventRules(...)` in `avara.sol`
- **Reputation Kernel**  
  Score tracking → `reputation` mapping updated on POAP issuance in `avara.sol`

---

## ABIs (for UIs / scripts)

**Directory:** `event-vax/krnl/src/contracts/`
- `AvaraCore.json`
- `POAPNFT.json`
- `TicketNFT.json`

---

## ▶️ Run the KRNL demo dApp (local)

```bash
cd event-vax/krnl/hello-krnl/frontend
npm install
npm run type-check
npm run build
npm run dev
```

Environment variables (example):
```env
VITE_PRIVY_APP_ID=...
VITE_KRNL_NODE_URL=https://node.krnl.xyz
VITE_DELEGATED_ACCOUNT_ADDRESS=0x...
VITE_AVARA_CORE_ADDRESS=0x...
VITE_RPC_URL=...
```

---

 *“Where is KRNL used?”*:

- **KRNL SDK** is used in `event-vax/krnl/hello-krnl/frontend/`:
  - `src/App.tsx` (`KRNLProvider` from `@krnl-dev/sdk-react-7702`)
  - `src/lib/krnl.ts` (`createConfig` from `@krnl-dev/sdk-react-7702`)
  - `src/hooks/useTestScenario.ts` (`useKRNL`, `useNodeConfig`, workflow execution)
- **KRNL contract enforcement** is implemented in `event-vax/krnl/avara/contracts/avara.sol`:
  - `krnlSigner` stored on-chain
  - `_verifyKrnlSignature(...)` (ECDSA verification)
  - `mintTicketWithKrnl(...)` and `checkInAndMintPOAP(...)` gated by KRNL signatures

## 🔮 Vision

Avara redefines event access by combining **decentralized trust**, **real-world usability**, and **inclusive design**.

By bridging USSD, mobile money, and on-chain verification through KRNL, Avara unlocks the next generation of accessible, fraud-resistant, and globally scalable event systems.

---

## 📊 Project Status

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Build](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge)

---


