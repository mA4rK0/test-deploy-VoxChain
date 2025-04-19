// lib/client.ts
import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client
const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side

export const CONTRACT_ADDRESS = "0xC6731c047802A192AD2d44cc383455F12f32485B";

export const client = createThirdwebClient(secretKey ? { secretKey } : { clientId });

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
