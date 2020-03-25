export default function generateRandomName() {
  return String(Date.now()) + String(Math.floor(Math.random() * 65536));
}