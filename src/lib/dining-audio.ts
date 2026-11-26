import { publicPath } from "./public-path";

export function diningAudio(level: "1" | "2" | "3", clip: string) {
  return publicPath(`/audio/dining/${level}/${clip}.mp3?v=yunyang-xiaoxiao`);
}
