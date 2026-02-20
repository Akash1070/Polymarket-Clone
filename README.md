# Polymarket‑Style Clone on Ethereum

This repo implements a Polymark‑style decentralized prediction market platform on Ethereum, designed to support **YES/NO outcome markets**, **event resolution oracles**, **liquidity‑driven pricing**, and **non‑custodial trading**.

Architecturally, the system mirrors the Polymarket event‑trading model but with a simpler, more modular reference stack than production‑level platforms that use hybrid CLOBs and on‑chain Conditional Tokens.

The core is:

- **Ethereum‑based smart contracts** (Solidity + Hardhat)  
- **YES/NO outcome markets** anchored to external events  
- **Automated resolution via an oracle** (e.g., Chainlink, UMA, or a custom oracle)  
- **User wallet → contract interaction** (no custodial funds)  

This architecture is intended to be **forkable, auditable, and extensible** for founders who want to build on top of it (e.g., Polymarket‑style clone, niche prediction markets, DeFi‑style events, creator economy betting, etc.).

***

## Core Components

### 1. Smart Contract Layer (Ethereum, Solidity)

The contract suite is built for **binary outcome markets** where users trade YES/NO shares.

#### Key Contracts

**`MarketFactory.sol`**

- Manages creation of markets (event titles, outcome conditions, resolution time, fee parameters, oracle address, etc.).  
- Can be restricted so only approved addresses can call `createMarket()` (useful for governance or admin‑only deployment).

**`PredictionMarket.sol`** *(per‑market)*

Each market is a contract instance with state:

- `eventTitle`  
- `resolutionTimestamp`  
- `oracle` (address)  
- `outcome` (`YES` / `NO` / `UNRESOLVED`)  
- `feeBasisPoints` (e.g., 0–300 → 0–3%)  
- User balances for `YES` shares and `NO` shares  

Implements:

- `buyYes(uint256 amount)`  
- `buyNo(uint256 amount)`  
- `sellYes(uint256 amount)`  
- `sellNo(uint256 amount)`  
- `collectWinnings()`  
- `resolveViaOracle(bytes calldata oracleData)`  

This is a **pure on‑chain AMM‑style liquidity pool** for two tokens (YES/NO) priced between 0 and 1, with a **1‑to‑1 scalar** and **100% payout at resolution**.

#### Pricing Logic (LMSR‑style / AMM‑style)

Most Polymarket‑style clones use a simplified **automated market maker (AMM)** for YES/NO outcomes instead of a full CLOB. The repo follows an AMM‑style internal pricing model:

- The contract tracks `YESReserves` and `NOReserves` in units (e.g., USDC).  
- When you `buyYes`, the price moves up according to:  
  - `price = YESReserves / (YESReserves + NOReserves)`  
- The contract adjusts reserves using a **constant product or linear cost function** (not necessarily LMSR, but similarly convex).  

In practice, the UI displays:

- `YES = 0.70 USDC` → 70% implied probability  
- `NO = 0.30 USDC` → 30%  

This gives you **Polymarket‑style UX** (share prices as probabilities) while keeping the on‑chain logic deterministic and simple.

#### Fee Mechanics

- **Entry fee:** A small fee in basis points (e.g., 3.8% on low‑probability entry, 0.9% on high‑probability) applied at trade time.  
- **Exit / Winnings fee:** **0.36%** applied only on **profit**, not on principal.  
- These parameters are **configurable per‑market** (or via a global fee registry contract).  

> **Note (for your specific Polymarket clone):**  
> In your live Polymarket‑style system using Solana, the fee logic is already implemented with **sliding‑scale fees** and **0.36% fee on profit only**.  
> This Ethereum repo is a **conceptual reference** for the same logic but without Solana account‑model quirks.

***

### 2. Oracle & Resolution Logic

The contracts are **oracle‑agnostic** by design. You can plug in:

- **Chainlink Data Feed** (e.g., BTC/USD, stock index, etc.)  
- **UMA Optimistic Oracle** (for event‑based markets where disputes are possible)  
- Or a **custom oracle contract** that emits `event Resolved(uint256 marketId, bool didYesWin)`  

#### How Resolution Works

1. **Oracle submits outcome** (or calls `resolveViaOracle` with signed data).  
2. Contract sets `outcome = YES/NO` and finalizes the payout pool.  
3. Users call `collectWinnings()` to redeem **1 share → 1 unit** (e.g., 1 USDC) if on the winning side, **0** if on the losing side.  

This is a **1:1 payout** model, as in your Solana‑based clone: **losers fund winners**, the contract only takes the explicitly configured fee.

***

### 3. Frontend Stack (DApp Architecture)

This repo’s frontend is a typical **Web3 DApp stack** tailored for Polymarket‑style UX.

- **Framework:** Next.js (or similar React‑based stack) for SSR, routing, and developer DX.  
- **Wallet integration:** WalletConnect / MetaMask for Ethereum accounts and transaction signing.  
- **Styling:** Tailwind CSS for responsive UI.  
- **Libraries:** `ethers.js` or `wagmi` for interacting with contracts, reading balances, and submitting transactions.  

#### Key Frontend Pages

- **Home / Market List:** Lists all markets with `eventTitle`, `resolutionTime`, YES/NO prices, and liquidity indicators.  
- **Market Detail:** Shows price chart (implied probability), your position (YES/NO balances), and trade form (buy/sell amounts, fees, net PnL estimate).  
- **Create Market (admin‑only):** Admin UI for defining event conditions, resolution time, oracle address, and fee parameters.  

#### Data Flow (Frontend ↔ Smart Contracts)

- Contracts expose state via view functions (`getYesReserves`, `getNoReserves`, `getPrice(YES/NO)`, `getBalance(account)`) and expose them to the UI.  
- User trades trigger `buyYes`, `buyNo`, `sellYes`, `sellNo`, `collectWinnings` via `ethers.js` / `wagmi`.  
- **Real‑time updates:** Polling or Subgraph setup to track user positions, market volumes, and open interest.  

***

### 4. Deployment & Network (Ethereum‑based reference)

- **Network:** Designed initially for Ethereum mainnet or a testnet (Goerli, Sepolia, etc.).  
- **Tooling:** Hardhat + Foundry‑style stack for testing, deployment, and environment management.  
- **Deployment workflow:**  
  1. Compile contracts  
     ```bash
     npx hardhat compile
     ```  
  2. Run tests  
     ```bash
     npx hardhat test
     ```  
  3. Deploy via Hardhat script  
     ```bash
     npx hardhat deploy --network mainnet
     ```  

This mimics the **Polymarket‑style deployment pattern**, where contracts are deployed modularly (`factory → markets`) and interfaces are exposed for indexers.

***

## How This Relates to Your Polymarket‑Style Clone (Solana + Our Polymarket Clone‑style)

While this repo is **Ethereum‑based** and uses Solidity, it conceptually mirrors the **core logic** of your Polymarket‑style clone on Solana:

| Feature | Your Solana‑based clone (Our Polymarket Clone‑style) | Ethereum‑based clone repo |
| --- | --- | --- |
| **Chain** | Solana (low‑gas, high‑speed) | Ethereum (high‑cost, battle‑tested) |
| **Token** | USDC, 1:1 payout, 0.36% fee on profits | Synthetic USDC‑like share tokens (YES/NO), fee‑only on trades/profits |
| **Trading model** | Fast Markets (Pyth‑based) + Long‑form markets | AMM‑style YES/NO markets, no Fast‑markets concept yet |
| **Oracle** | Pyth Network for real‑time, trustless price feeds | UMA / Chainlink / custom oracle, trustless resolution for events |
| **Fee structure** | Sliding‑scale fees (0.9–3.8%), 0.36% on profit | Configurable `feeBasisPoints` in contract, similarly 0.36% on profit conceptually |

This repo is therefore a **reference implementation** for Polymarket‑style semantics on Ethereum, helping developers understand the **core math and state design** before building on top of your own Solana‑based system.

***

## For Developers: Getting Started on This Repo

To get up and running locally and understand how the solution works:

### 1. Clone and Install

```bash
git clone https://github.com/Akash1070/Polymarket-Clone.git
cd Polymarket-Clone
npm install
```

### 2. Set Up Environment (`.env`)

```env
ALCHEMY_API_KEY=your_ethereum_node
PRIVATE_KEY=your_deployer_key
NETWORK=sepolia
```

### 3. Test Contracts

```bash
npx hardhat test
```

Check that all markets, reserves, fees, and resolution logic behave as expected (e.g., 1:1 payout, fees subtracted correctly, no rounding errors).

### 4. Deploy Locally or on Testnet

```bash
npx hardhat deploy --network sepolia
```

Verify deployment of `MarketFactory` and at least one `PredictionMarket` instance, and inspect contract addresses.

### 5. Connect Frontend

Run the frontend:

```bash
npm run dev
```

Connect wallet and trade YES/NO shares. Observe the price move according to the AMM‑style math and check that `collectWinnings` works after resolution.

***

## License & Codebase Notes

- **License:** MIT (open‑source, contributable, no vendor lock‑in).  
- **Code Style:** Solidity using **ERC‑style patterns**, clear separation of concerns (`factory`, `market`, `oracle`, `fee registry`), and developer‑friendly comments.  
- **Auditing:** This is a **reference implementation**; in production‑grade clones, contracts should be audited by third‑party firms (e.g., OpenZeppelin, Quantstamp, etc.).

## Our Live Polymarket‑Style Clone (Solana)

Our clone is **live** on **Solana and Eth**. Not a prototype or waitlist.  

A **functioning decentralized prediction market on Solana** with **USDC markets across eight sectors**, **Fast Markets resolving on verified Pyth data**, and a **fee structure visible before you commit a single dollar**.  

The next 18 months will produce the prediction market infrastructure that **prices the next decade of human decisions**.  
**Don’t be the person who was watching when you could have been building.**

→ Explore our Polymarket‑style clone live: [https://Our Polymarket Clonemarkets.com](https://Our Polymarket Clonemarkets.com)  
→ Inquire about your custom Polymarket clone: [https://t.me/akash_kumar107](https://t.me/akash_kumar107)  
→ Book a technical walkthrough: [Product Development Consultation with Akash Kumar Jha](https://topmate.io/yourweb3guy/1448127?utm_source=public_profile&utm_campaign=yourweb3guy)

***

