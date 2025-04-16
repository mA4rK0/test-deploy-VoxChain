# VoxChain

VoxChain is a decentralised voting platform built on blockchain technology. With VoxChain, anyone can create and participate in polls with the assurance of security, transparency, and no central authority.

## Main Features

-   ✅ Create on-chain polls
-   📊 Voting is done with your wallet account
-   🔒 Data stored on blockchain (immutability & transparency)
-   📝 Auditable smart contracts
-   🌐 Integrated with wallets like MetaMask

## Tools

- **Solidity** – Smart contracts
- **Foundry** – Development & testing
- **Thirdweb** - Prebuilt smart contracts, SDK, and dashboard UI for blockchain
- **Next.js** - Front-end Framework
- **Tailwind CSS** - CSS Framework
- **Sepolia Testnet** - Blockchain Network

## Installation & Run Project

### Clone Repository

```shell
git clone https://github.com/VoxChain-Xero-01/VoxChain-Xero-01.git
cd VoxChain-Xero-01
```

### Install Dependencies

```shell
# Smart Contracts
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge install

# Front-end
cd ../FrontEnd/vox_chain-xero-01
npm install
```

### .env Configuration

create an `.env` file inside the FrontEnd/vox_chain-xero-01 folder

```.env
THIRDWEB_SECRET_KEY=YOUR_THIRDWEB_SECRET_KEY
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

### Test

```shell
forge test -vvv
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/VotingSystem.s.sol:VotingSystemScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

## Licence

This project uses the MIT License.

Created by [@mA4rK0](https://github.com/mA4rK0) & [@isfndiar](https://github.com/isfndiar).
