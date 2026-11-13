import React from "react";
import { CyberGirlFullBodyAvatar } from "./CyberGirlFullBodyAvatar";
import { AvatarBodyMovement, HologramDisplayMode, StandbyAnimationType } from "../types";

interface RealGirlTalkingAvatarProps {
  isSpeaking: boolean;
  isListening?: boolean;
  personalityName?: string;
  outfitName?: string;
  bodyMovement?: AvatarBodyMovement;
  standbyAnimation?: StandbyAnimationType;
  hologramMode?: HologramDisplayMode;
  cinematicTrigger?: number;
  outfitChangingBurst?: boolean;
  size?: "sm" | "md" | "lg" | "uhd";
}

export const RealGirlTalkingAvatar: React.FC<RealGirlTalkingAvatarProps> = ({
  isSpeaking,
  isListening = false,
  personalityName = "Zoya (Your Cyber Girlfriend)",
  bodyMovement = "idle",
  standbyAnimation = "breathe",
  hologramMode = "face",
  cinematicTrigger = 0,
  size = "lg",
}) => {
  return (
    <CyberGirlFullBodyAvatar
      isSpeaking={isSpeaking}
      isListening={isListening}
      bodyMovement={bodyMovement}
      standbyAnimation={standbyAnimation}
      hologramMode={hologramMode}
      cinematicTrigger={cinematicTrigger}
      personalityName={personalityName}
      size={size}
    />
  );
};
