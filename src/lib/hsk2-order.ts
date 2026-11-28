export const orders = [
  { count: 2, label: "两个包子", price: "六元", spokenPrice: "两个包子，六元。" },
  { count: 3, label: "三个包子", price: "九元", spokenPrice: "三个包子，九元。" },
] as const;

export const orderScript = {
  prompt: { role: "server", text: "你好！一个包子三元。你要几个包子？" },
  ask: { role: "customer", text: "多少钱？" },
  "price-2": { role: "server", text: orders[0].spokenPrice },
  "price-3": { role: "server", text: orders[1].spokenPrice },
  "confirm-2": { role: "customer", text: "对，我要两个包子。谢谢！" },
  "confirm-3": { role: "customer", text: "对，我要三个包子。谢谢！" },
} as const;
