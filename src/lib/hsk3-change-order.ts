export const changeOrderScript = {
  opening: { role: "server", text: "您好，您觉得这个饮料怎么样？" },
  request: { role: "customer", text: "这个饮料太甜了，可以给我换成水吗？" },
  misunderstanding: { role: "server", text: "好的，给您换成茶，对吗？" },
  correction: { role: "customer", text: "不是茶，是水。谢谢！" },
  confirmation: { role: "server", text: "明白了，给您换成水。" },
  recap: { role: "customer", text: "这个饮料太甜了，所以我请店员给我换成了水。" },
} as const;
