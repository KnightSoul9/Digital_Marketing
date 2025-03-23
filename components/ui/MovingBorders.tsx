"use client";
import React, { memo, useRef, useCallback } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Define proper types for the components
interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}

interface ButtonProps {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}

// Memoized MovingBorder component to prevent unnecessary re-renders
const MovingBorder = memo(
  ({ children, duration = 2000, rx, ry, ...otherProps }: MovingBorderProps) => {
    // Use SVGSVGElement for the path ref
    const pathRef = useRef<SVGRectElement | null>(null);
    const progress = useMotionValue(0);

    // Use useCallback to optimize animation frame callback
    const updateProgress = useCallback(
      (time: number) => {
        const path = pathRef.current;
        if (path) {
          // Explicitly check for getTotalLength method
          const length = path.getTotalLength?.() || 0;
          if (length) {
            const pxPerMillisecond = length / duration;
            progress.set((time * pxPerMillisecond) % length);
          }
        }
      },
      [duration, progress]
    );

    useAnimationFrame(updateProgress);

    const x = useTransform(progress, (val) => {
      if (
        pathRef.current &&
        typeof pathRef.current.getPointAtLength === "function"
      ) {
        return pathRef.current.getPointAtLength(val)?.x || 0;
      }
      return 0;
    });

    const y = useTransform(progress, (val) => {
      if (
        pathRef.current &&
        typeof pathRef.current.getPointAtLength === "function"
      ) {
        return pathRef.current.getPointAtLength(val)?.y || 0;
      }
      return 0;
    });

    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
          {...otherProps}
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx={rx}
            ry={ry}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-block",
            transform,
          }}
        >
          {children}
        </motion.div>
      </>
    );
  }
);

MovingBorder.displayName = "MovingBorder";

// Memoized Button component
const Button = memo(
  ({
    borderRadius = "1.75rem",
    children,
    as: Component = "button",
    containerClassName,
    borderClassName,
    duration,
    className,
    ...otherProps
  }: ButtonProps) => {
    // Calculate derived values outside of render
    const innerBorderRadius = `calc(${borderRadius} * 0.96)`;

    return (
      <Component
        className={cn(
          "bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2 md:row-span-1",
          containerClassName
        )}
        style={{
          borderRadius: borderRadius,
        }}
        {...otherProps}
      >
        <div
          className="absolute inset-0"
          style={{ borderRadius: innerBorderRadius }}
        >
          <MovingBorder duration={duration} rx="30%" ry="30%">
            <div
              className={cn(
                "h-20 w-20 opacity-[0.8] bg-[radial-gradient(#CBACF9_40%,transparent_60%)]",
                borderClassName
              )}
            />
          </MovingBorder>
        </div>

        <div
          className={cn(
            "relative bg-slate-900/[0.] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
            className
          )}
          style={{
            borderRadius: innerBorderRadius,
          }}
        >
          {children}
        </div>
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button, MovingBorder };
