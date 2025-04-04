export default function copyToClipboard(text: string) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject("Clipboard API not supported");
}
