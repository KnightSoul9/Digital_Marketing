"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Use refs for position tracking to avoid unnecessary re-renders
  const positionRef = useRef({
    curX: 0,
    curY: 0,
    tgX: 0,
    tgY: 0,
  });

  // Detect Safari only once
  const isSafari = useMemo(() => {
    if (typeof window !== "undefined") {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    return false;
  }, []);

  // Set CSS variables only once when props change
  useEffect(() => {
    const cssVars = {
      "--gradient-background-start": gradientBackgroundStart,
      "--gradient-background-end": gradientBackgroundEnd,
      "--first-color": firstColor,
      "--second-color": secondColor,
      "--third-color": thirdColor,
      "--fourth-color": fourthColor,
      "--fifth-color": fifthColor,
      "--pointer-color": pointerColor,
      "--size": size,
      "--blending-value": blendingValue,
    } as Record<string, string>;

    // Batch style updates
    Object.entries(cssVars).forEach(([key, value]) => {
      document.body.style.setProperty(key, value);
    });

    return () => {
      // Clean up CSS variables
      Object.keys(cssVars).forEach((key) => {
        document.body.style.removeProperty(key);
      });
    };
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  // Optimized animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    if (!interactiveRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const { curX, curY, tgX, tgY } = positionRef.current;

    // Calculate new position with easing
    const nextX = curX + (tgX - curX) / 20;
    const nextY = curY + (tgY - curY) / 20;

    // Only update DOM if there's meaningful change
    if (Math.abs(nextX - curX) > 0.1 || Math.abs(nextY - curY) > 0.1) {
      positionRef.current.curX = nextX;
      positionRef.current.curY = nextY;

      // Optimize by rounding values and using transform
      interactiveRef.current.style.transform = `translate(${Math.round(
        nextX
      )}px, ${Math.round(nextY)}px)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Start and clean up animation loop
  useEffect(() => {
    if (interactive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, interactive]);

  // Optimized mouse move handler
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!interactiveRef.current) return;

      const rect = interactiveRef.current.getBoundingClientRect();
      positionRef.current.tgX = event.clientX - rect.left;
      positionRef.current.tgY = event.clientY - rect.top;
    },
    []
  );

  // Memoize the SVG filter to avoid re-creating it
  const svgFilter = useMemo(
    () => (
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    ),
    []
  );

  // Shared gradient classes for better compression
  const gradientBaseClasses = useMemo(
    () =>
      cn(
        `absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
        `[mix-blend-mode:var(--blending-value)]`
      ),
    []
  );

  return (
    <div
      className={cn(
        "w-full h-full absolute overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      {svgFilter}
      <div className={cn("", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full blur-lg will-change-transform",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
      >
        <div
          className={cn(
            gradientBaseClasses,
            `[background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `[transform-origin:center_center]`,
            `animate-first`,
            `opacity-100`
          )}
        />
        <div
          className={cn(
            gradientBaseClasses,
            `[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[transform-origin:calc(50%-400px)]`,
            `animate-second`,
            `opacity-100`
          )}
        />
        <div
          className={cn(
            gradientBaseClasses,
            `[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[transform-origin:calc(50%+400px)]`,
            `animate-third`,
            `opacity-100`
          )}
        />
        <div
          className={cn(
            gradientBaseClasses,
            `[background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[transform-origin:calc(50%-200px)]`,
            `animate-fourth`,
            `opacity-70`
          )}
        />
        <div
          className={cn(
            gradientBaseClasses,
            `[background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth`,
            `opacity-100`
          )}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`
            )}
          />
        )}
      </div>
    </div>
  );
};
