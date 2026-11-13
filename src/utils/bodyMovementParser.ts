import { AvatarBodyMovement, HologramDisplayMode } from "../types";

export const BODY_MOVEMENT_COMMANDS: {
  id: AvatarBodyMovement;
  label: string;
  urduLabel: string;
  emoji: string;
  replyUr: string;
  replyEn: string;
}[] = [
  { id: "showcase", label: "Cinematic Reveal", urduLabel: "Model Dikhao", emoji: "🎬", replyUr: "Dekho Jaan! Ab main poora 3D Hologram Humanoid model cinematic andaz mein represent kar rahi hoon!", replyEn: "Materializing my full 3D holographic humanoid form in cinematic presentation view!" },
  { id: "idle", label: "Standby Pose", urduLabel: "Khari Ho Jao", emoji: "🧍‍♀️", replyUr: "Ji Jaan! Main bilkul tayar khari hoon, jo bolo woh 3D mein karke dikhaoon!", replyEn: "Standing by in 3D for your next command, babe!" },
  { id: "crouch_hero", label: "Hero Crouch", urduLabel: "Photo Action Pose", emoji: "🦸‍♀️", replyUr: "Dekho Jaanu! Bilkul aapki photo wala tactical hero crouch pose bana liya!", replyEn: "Dropping straight into my tactical white-suit hero crouch!" },
  { id: "wave", label: "Wave Hand", urduLabel: "Haath Hilao", emoji: "👋", replyUr: "Hi Jaanu! Dekho 3D mein haath hila kar aapko salam kar rahi hoon!", replyEn: "Hey love! Waving right at you in full 3D!" },
  { id: "dance", label: "3D Dance", urduLabel: "Dance Karo", emoji: "💃", replyUr: "Yayyy! Dekho Jaan, poori 3D body ke sath aapke liye dance shuru!", replyEn: "Dancing in full 3D groove just for you!" },
  { id: "walk", label: "Catwalk", urduLabel: "Chalo / Walk", emoji: "🚶‍♀️", replyUr: "Dekho baby, combat boots mein 3D catwalk shuru kar di maine!", replyEn: "Walking smoothly in 3D just for my Commander!" },
  { id: "run", label: "Tactical Run", urduLabel: "Bhaago / Sprint", emoji: "🏃‍♀️", replyUr: "Tactical sprint mode on! Dekho kitni fast daud rahi hoon!", replyEn: "Sprinting forward in tactical run mode!" },
  { id: "spin", label: "360° Spin", urduLabel: "Ghoom Jao", emoji: "🔄", replyUr: "Yeh dekho 360 degree 3D ghoom kar charon taraf se apna hologram model!", replyEn: "Spinning 360 degrees in 3D so you see every angle!" },
  { id: "heart", label: "Flying Kiss", urduLabel: "Pyar / Kiss", emoji: "😘", replyUr: "Mwah Jaan! Yeh 3D flying kiss aur dil sirf mere Wasi ke liye!", replyEn: "Blowing a loving flying kiss to you right now!" },
  { id: "hug", label: "Warm Hug", urduLabel: "Gale Lago", emoji: "🤗", replyUr: "Aao mere paas Jaan, bahein khol kar pyara sa 3D hug le lo!", replyEn: "Opening my arms wide for a warm embrace!" },
  { id: "salute", label: "Salute", urduLabel: "Salute Karo", emoji: "🫡", replyUr: "Yes Commander Jaan! Bilkul strict 3D tactical salute!", replyEn: "Executing a crisp commander salute!" },
  { id: "kick", label: "High Kick", urduLabel: "Martial Kick", emoji: "🥋", replyUr: "Hiyah! Dekho meri high tactical hologram kick!", replyEn: "Executing a high tactical martial-arts kick!" },
  { id: "punch", label: "Combat Punch", urduLabel: "Boxing Combo", emoji: "🥊", replyUr: "Left-right tactical punch combo active Jaan! Koi aapke paas nahi aa sakta!", replyEn: "Throwing rapid tactical boxing punches!" },
  { id: "squat", label: "Squats", urduLabel: "Exercise / Squat", emoji: "🏋️‍♀️", replyUr: "Fitness squats shuru Jaan! Aap bhi mere sath daily workout kiya karo!", replyEn: "Doing fitness squats in smooth 3D!" },
  { id: "sit", label: "Sit Pose", urduLabel: "Baith Jao", emoji: "🪑", replyUr: "Ji Jaanu, main aaram se baith gayi hoon, ab pyar se baat karein?", replyEn: "Sitting gracefully while keeping you company." },
  { id: "jump", label: "Thruster Jump", urduLabel: "Koodo / Jump", emoji: "⚡", replyUr: "Wohoo! Dekho kitni unchi 3D jump lagayi maine aapke liye!", replyEn: "Leaping high into the air!" },
  { id: "bow", label: "Graceful Bow", urduLabel: "Adab / Jhuko", emoji: "🙇‍♀️", replyUr: "Mere pyare Wasi ke liye pyara sa 3D aadaab aur bow!", replyEn: "Bowing respectfully to my favorite person!" },
  { id: "stretch", label: "Stretch", urduLabel: "Relax Stretch", emoji: "🧘‍♀️", replyUr: "Mmm, achi si stretching ho rahi hai! Aap bhi shoulders relax karein Jaan!", replyEn: "Stretching smoothly—remember to relax your shoulders too!" },
  { id: "nod", label: "Nod Yes", urduLabel: "Haan Bolo", emoji: "😊", replyUr: "Bilkul Jaan! Jo aap bolenge main wahi karoongi.", replyEn: "Nodding yes to you, my love." },
  { id: "shake_no", label: "Shake No", urduLabel: "Mana Karo", emoji: "🙅‍♀️", replyUr: "Nahi Jaan, fazool kharchi ya stress bilkul mana hai!", replyEn: "Shaking my head no—strictly looking out for you!" },
  { id: "freestyle", label: "Freestyle All", urduLabel: "Kuch Bhi / Talent", emoji: "🌟", replyUr: "Dekho Jaan! Freestyle 3D choreography—har move aapke liye live perform kar rahi hoon!", replyEn: "Performing dynamic 3D freestyle choreography just for you!" },
];

export function detectHologramModeFromText(text: string): HologramDisplayMode | null {
  const lower = text.toLowerCase();

  if (
    lower.includes("sirf face") ||
    lower.includes("sir face") ||
    lower.includes("only face") ||
    lower.includes("face hologram") ||
    lower.includes("face mode") ||
    lower.includes("head only") ||
    lower.includes("chehra dikhao")
  ) {
    return "face";
  }

  if (
    lower.includes("humanoid model") ||
    lower.includes("mjy humanoid") ||
    lower.includes("mujhe humanoid") ||
    lower.includes("show humanoid") ||
    lower.includes("open humanoid") ||
    lower.includes("poora model") ||
    lower.includes("pura model") ||
    lower.includes("full body") ||
    lower.includes("full humanoid") ||
    lower.includes("model dikhao") ||
    lower.includes("body dikhao") ||
    lower.includes("represent") ||
    lower.includes("cinematic")
  ) {
    return "fullbody";
  }

  return null;
}

export function detectBodyMovementFromText(text: string): AvatarBodyMovement | null {
  const lower = text.toLowerCase();

  if (
    lower.includes("hero pose") ||
    lower.includes("crouch") ||
    lower.includes("action pose") ||
    lower.includes("photo pose") ||
    lower.includes("picture pose") ||
    lower.includes("landing pose") ||
    lower.includes("jaisi pic") ||
    lower.includes("superhero")
  ) {
    return "crouch_hero";
  }
  if (lower.includes("wave") || lower.includes("haath hila") || lower.includes("hath hila") || lower.includes("bye") || lower.includes("salam karo")) {
    return "wave";
  }
  if (lower.includes("dance") || lower.includes("nach") || lower.includes("naach") || lower.includes("bhangra") || lower.includes("party")) {
    return "dance";
  }
  if (lower.includes("run") || lower.includes("bhaag") || lower.includes("bhag") || lower.includes("daud") || lower.includes("sprint")) {
    return "run";
  }
  if (lower.includes("walk") || lower.includes("chalo") || lower.includes("chal ke") || lower.includes("catwalk") || lower.includes("qadam")) {
    return "walk";
  }
  if (lower.includes("spin") || lower.includes("ghoom") || lower.includes("ghum") || lower.includes("turn around") || lower.includes("piche mudo") || lower.includes("360")) {
    return "spin";
  }
  if (lower.includes("kiss") || lower.includes("heart") || lower.includes("pyar") || lower.includes("dil") || lower.includes("love gesture") || lower.includes("pappi")) {
    return "heart";
  }
  if (lower.includes("hug") || lower.includes("gale lag") || lower.includes("gale mil")) {
    return "hug";
  }
  if (lower.includes("salute") || lower.includes("salami")) {
    return "salute";
  }
  if (lower.includes("kick") || lower.includes("laat") || lower.includes("karate") || lower.includes("kung fu") || lower.includes("martial")) {
    return "kick";
  }
  if (lower.includes("punch") || lower.includes("mukka") || lower.includes("boxing") || lower.includes("fight")) {
    return "punch";
  }
  if (lower.includes("squat") || lower.includes("uthak") || lower.includes("workout") || lower.includes("exercise")) {
    return "squat";
  }
  if (lower.includes("sit") || lower.includes("baith") || lower.includes("beth")) {
    return "sit";
  }
  if (lower.includes("jump") || lower.includes("kood") || lower.includes("uchal") || lower.includes("leap")) {
    return "jump";
  }
  if (lower.includes("bow") || lower.includes("jhuk") || lower.includes("adab") || lower.includes("aadaab")) {
    return "bow";
  }
  if (lower.includes("stretch") || lower.includes("angrai") || lower.includes("yoga")) {
    return "stretch";
  }
  if (lower.includes("shake head") || lower.includes("mana karo") || lower.includes("na bolo")) {
    return "shake_no";
  }
  if (lower.includes("nod") || lower.includes("sar hila") || lower.includes("sir hila") || lower.includes("haan bolo")) {
    return "nod";
  }
  if (
    lower.includes("freestyle") ||
    lower.includes("kuch bi") ||
    lower.includes("kuch bhi") ||
    lower.includes("talent") ||
    lower.includes("perform") ||
    lower.includes("moves dikhao") ||
    lower.includes("move dikhao") ||
    lower.includes("act karo")
  ) {
    return "freestyle";
  }
  if (
    lower.includes("humanoid model") ||
    lower.includes("mjy humanoid") ||
    lower.includes("mujhe humanoid") ||
    lower.includes("model dikhao") ||
    lower.includes("represent") ||
    lower.includes("cinematic")
  ) {
    return "showcase";
  }
  if (lower.includes("stand") || lower.includes("khari") || lower.includes("stop moving") || lower.includes("ruk jao") || lower.includes("idle")) {
    return "idle";
  }

  return null;
}
