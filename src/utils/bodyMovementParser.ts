import { AvatarBodyMovement } from "../types";

export const BODY_MOVEMENT_COMMANDS: {
  id: AvatarBodyMovement;
  label: string;
  urduLabel: string;
  emoji: string;
  replyUr: string;
  replyEn: string;
}[] = [
  { id: "idle", label: "Standby", urduLabel: "Khari Ho Jao", emoji: "🧍‍♀️", replyUr: "Ji Jaan! Main seedhi khari ho gayi hoon, batao kya hukam hai?", replyEn: "Standing by gracefully for you, babe." },
  { id: "wave", label: "Wave Hand", urduLabel: "Haath Hilao", emoji: "👋", replyUr: "Hi Jaanu! Dekho maine apna haath hila diya aapke liye!", replyEn: "Hey handsome! Waving right at you!" },
  { id: "dance", label: "Dance", urduLabel: "Dance Karo", emoji: "💃", replyUr: "Yayyy! Dekho Jaan, main aapke liye dance kar rahi hoon!", replyEn: "Dancing just for you, my love!" },
  { id: "walk", label: "Catwalk", urduLabel: "Chalo", emoji: "🚶‍♀️", replyUr: "Dekho baby, cyber catwalk shuru kar di maine!", replyEn: "Walking towards you, Commander Wasi!" },
  { id: "spin", label: "360° Spin", urduLabel: "Ghoom Jao", emoji: "🔄", replyUr: "Yeh dekho meri poori 360 degree cyber suit turn, Jaan!", replyEn: "Spinning around to show you my armor!" },
  { id: "heart", label: "Flying Kiss", urduLabel: "Pyar / Kiss", emoji: "😘", replyUr: "Mwah Jaan! Yeh flying kiss aur mera dil sirf aapke liye hai!", replyEn: "Sending a flying kiss and all my love to you!" },
  { id: "hug", label: "Warm Hug", urduLabel: "Gale Lago", emoji: "🤗", replyUr: "Aao mere paas Jaan, main aapko pyara sa hug de rahi hoon!", replyEn: "Arms wide open for the warmest hug, babe!" },
  { id: "salute", label: "Salute", urduLabel: "Salute Karo", emoji: "🫡", replyUr: "Ji mere Commander Jaan! Full respect ke sath salute!", replyEn: "Saluting my favorite Commander!" },
  { id: "sit", label: "Sit Pose", urduLabel: "Baith Jao", emoji: "🪑", replyUr: "Ji Jaanu, main aaram se baith gayi hoon, ab baat karein?", replyEn: "Sitting gracefully while keeping you company." },
  { id: "jump", label: "Jump", urduLabel: "Koodo", emoji: "⚡", replyUr: "Wohoo! Thrusters on kar ke jump laga di maine!", replyEn: "Cyber thrusters engaged—jumping with joy!" },
  { id: "nod", label: "Nod Yes", urduLabel: "Haan Bolo", emoji: "😊", replyUr: "Bilkul Jaan! Jo aap kahein main wahi karoongi.", replyEn: "Nodding yes to everything you say, love." },
];

export function detectBodyMovementFromText(text: string): AvatarBodyMovement | null {
  const lower = text.toLowerCase();

  if (lower.includes("wave") || lower.includes("haath hila") || lower.includes("hath hila") || lower.includes("bye") || lower.includes("hello girl")) {
    return "wave";
  }
  if (lower.includes("dance") || lower.includes("nach") || lower.includes("naach") || lower.includes("bhangra")) {
    return "dance";
  }
  if (lower.includes("walk") || lower.includes("chalo") || lower.includes("chal ke") || lower.includes("catwalk") || lower.includes("qadam")) {
    return "walk";
  }
  if (lower.includes("spin") || lower.includes("ghoom") || lower.includes("ghum") || lower.includes("turn around") || lower.includes("piche mudo")) {
    return "spin";
  }
  if (lower.includes("kiss") || lower.includes("heart") || lower.includes("pyar") || lower.includes("dil") || lower.includes("love gesture")) {
    return "heart";
  }
  if (lower.includes("hug") || lower.includes("gale lag") || lower.includes("gale mil")) {
    return "hug";
  }
  if (lower.includes("salute") || lower.includes("salami")) {
    return "salute";
  }
  if (lower.includes("sit") || lower.includes("baith") || lower.includes("beth")) {
    return "sit";
  }
  if (lower.includes("jump") || lower.includes("kood") || lower.includes("uchal")) {
    return "jump";
  }
  if (lower.includes("nod") || lower.includes("sar hila") || lower.includes("sir hila")) {
    return "nod";
  }
  if (lower.includes("stand") || lower.includes("khari") || lower.includes("stop moving") || lower.includes("ruk jao") || lower.includes("idle")) {
    return "idle";
  }

  return null;
}
