export default function shortenAddress(address: string) {
  return address.slice(0, 2) + "..." + address.slice(-4);
}
