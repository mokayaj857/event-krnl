# KRNL Kernel Alignment (Ticket, Attendance/POAP, Marketplace, Reputation)

This folder already contains both the KRNL demo dApp (`hello-krnl/frontend`) that uses the KRNL SDK, and the KRNL-enabled smart contracts (`avara/contracts/avara.sol`). This document maps the four kernels you described to the existing code.

## Frontend (KRNL SDK)
- Path: `hello-krnl/frontend/`
- SDK usage:
  - `src/App.tsx` wraps the app with `KRNLProvider` from `@krnl-dev/sdk-react-7702`.
  - `src/lib/krnl.ts` creates the KRNL config (`createConfig`).
  - `src/hooks/useTestScenario.ts` demonstrates workflow execution with KRNL hooks.

## Smart Contracts (KRNL signer & verification)
- Path: `avara/contracts/avara.sol`
- Kernel mapping:
  - **Ticket Kernel**: `mintTicketWithKrnl` (KRNL-signed mint); `TicketNFT` provenance tracking.
  - **Attendance & POAP Kernel**: `checkInAndMintPOAP` (KRNL-signed check-in + POAP mint).
  - **Marketplace Kernel**: Listing/buying with rule enforcement (`listTicket`, `buyTicket`, `rules`, `maxResalePrice`, `maxTransfers`).
  - **Reputation Kernel**: `reputation` mapping incremented on POAP mint; admin setters for scores.
- KRNL signer:
  - `krnlSigner` stored on-chain.
  - `_verifyKrnlSignature` enforces KRNL-signed actions (`MINT`, `CHECKIN`, etc.).

## ABIs for integration
- Path: `src/contracts/` in this folder:
  - `AvaraCore.json`
  - `POAPNFT.json`
  - `TicketNFT.json`
These can be imported by any frontend to call the KRNL-enabled contract functions.

## How to build/test the demo dApp
> This environment lacks `/usr/bin/bash`, so npm scripts may fail here. Run locally on your machine:
```bash
cd event-vax/krnl/hello-krnl/frontend
npm install
npm run type-check
npm run lint
npm run build
```
If your shell is not at `/usr/bin/bash`, set `SHELL=/bin/sh` before running npm scripts:
```bash
SHELL=/bin/sh npm run build
```

## Next steps to wire into another app
If you want these kernels in your main UI:
1) Install: `@krnl-dev/sdk-react-7702`, `@privy-io/react-auth`, `viem`.
2) Copy `lib/krnl.ts`, wrap your app with `KRNLProvider`, and add hooks/components that call the AvaraCore ABI above.
3) Point your UI to the `AvaraCore` address you deploy (with `krnlSigner` set).


