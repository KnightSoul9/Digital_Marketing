"use client";

import React, { memo } from "react";

interface MagicButtonProps {
  title: string;
  icon: React.ReactNode;
  position: "left" | "right";
  handleClick?: () => void;
  otherClasses?: string;
}

const MagicButton = memo(
  ({
    title,
    icon,
    position,
    handleClick,
    otherClasses = "",
  }: MagicButtonProps) => {
    // Memoize the animation styles to avoid recalculations on re-renders
    const animationStyle =
      "absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]";

    const buttonContentClass = `inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg
    bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${otherClasses}`;

    return (
      <button
        className="relative inline-flex h-12 w-full md:w-60 md:mt-10 overflow-hidden rounded-lg p-[1px] focus:outline-none"
        onClick={handleClick}
        type="button"
      >
        <span className={animationStyle} />
        <span className={buttonContentClass}>
          {position === "left" && icon}
          {title}
          {position === "right" && icon}
        </span>
      </button>
    );
  }
);

// Add display name for better debugging
MagicButton.displayName = "MagicButton";

export default MagicButton;
