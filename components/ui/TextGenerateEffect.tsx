"use client";

import React, { useEffect, useCallback, useMemo, memo } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

export const TextGenerateEffect = memo(
  ({ words, className }: TextGenerateEffectProps) => {
    const [scope, animate] = useAnimate();

    // Only split words array when the input changes
    const wordsArray = useMemo(() => words.split(" "), [words]);

    // Animation configuration
    const animationConfig = useMemo(
      () => ({
        opacity: 1,
        transition: { duration: 2, delay: stagger(0.2) },
      }),
      []
    );

    const runAnimation = useCallback(() => {
      // Use optimized animation approach
      animate("span", animationConfig, { duration: 2, delay: stagger(0.2) });
    }, [animate, animationConfig]);

    // Only re-run animation when dependencies change
    useEffect(() => {
      runAnimation();
    }, [runAnimation, words]); // Added words as dependency to re-trigger on content change

    // Pre-compute styles for better performance
    const containerStyles = useMemo(
      () => cn("font-bold", className),
      [className]
    );

    return (
      <div className={containerStyles}>
        <div className="my-4">
          <div className="dark:text-white text-black leading-snug tracking-wide">
            <motion.div ref={scope}>
              {wordsArray.map((word, idx) => (
                <motion.span
                  key={`${word}-${idx}`}
                  className={cn(
                    "opacity-0",
                    idx > 3 ? "text-purple" : "dark:text-white text-black"
                  )}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for better debugging
TextGenerateEffect.displayName = "TextGenerateEffect";
