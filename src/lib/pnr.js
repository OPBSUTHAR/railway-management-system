export function generatePNR() {
  const first = Math.floor(Math.random() * 9) + 1;
  let digits = String(first);
  for (let index = 0; index < 9; index += 1) {
    digits += String(Math.floor(Math.random() * 10));
  }
  return digits;
}

export function generateId(prefix = "ID") {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export async function hashPassword(username, password) {
  const payload = new TextEncoder().encode(`${username.toLowerCase()}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
