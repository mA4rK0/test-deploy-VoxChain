// lib/client.ts
import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client
const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side

// export const CONTRACT_ADDRESS = "0x1e1d1b4a9655746dA434Fa35514dc6d16b8B43E0";
// export const CONTRACT_ADDRESS = "0x36b555B57d4DF055eCf1C141365D5eDDD8EFA998";
// export const CONTRACT_ADDRESS = "0xcA201a13CC76bd7A0EE6F17Db034b3383C7597cc";
export const CONTRACT_ADDRESS = "0x7fd0B7E07dF7748545239C9F375051C5e629C24B";

export const client = createThirdwebClient(
  secretKey ? { secretKey } : { clientId }
);

export const contract = getContract({
  address: CONTRACT_ADDRESS,
  chain: sepolia,
  client,
});
export const wallet = [
  inAppWallet({
    auth: { options: ["email", "google", "passkey"] },
    hidePrivateKeyExport: true,
  }),
];
