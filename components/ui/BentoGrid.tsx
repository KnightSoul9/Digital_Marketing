"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

import { BackgroundGradientAnimation } from "./GradientBg";
import GridGlobe from "./GridGlobe";
import animationData from "@/data/confetti.json";
import MagicButton from "../MagicButton";

// Load Lottie dynamically to prevent SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only track client-side for components that need it (ID 6)
  useEffect(() => {
    if (id === 6) {
      setIsClient(true);
    }
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText("hsu@jsmastery.pro");
    setCopied(true);
  };

  // Pre-define tech stacks to avoid recreating arrays on each render
  const techStacks = {
    left: ["SEO", "PPC", "Content"],
    right: ["Social", "Email", "Analytics"],
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundImage:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className={`${id === 6 ? "flex justify-center" : ""} h-full`}>
        {/* Image Background - only render if img prop exists */}
        {img && (
          <div className="w-full h-full absolute">
            <Image
              src={img}
              alt="Bento Item"
              layout="fill"
              objectFit="cover"
              className={imgClassName}
              priority
            />
          </div>
        )}

        {/* Spare Image - only render if spareImg prop exists */}
        {spareImg && (
          <div
            className={`absolute right-0 -bottom-5 ${
              id === 5 ? "w-full opacity-80" : ""
            }`}
          >
            <Image
              src={spareImg}
              alt="Spare"
              layout="intrinsic"
              width={500}
              height={300}
              className="object-cover object-center w-full h-full"
            />
          </div>
        )}

        {/* Background Animation - only render for ID 6 */}
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 text-3xl md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}

        {/* Text Content */}
        <div
          className={cn(
            titleClassName,
            "relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          {/* Title */}
          {title && (
            <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
              {title}
            </div>
          )}
          {/* Description */}
          {description && (
            <div className="font-sans font-extralight md:max-w-50 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
              {description}
            </div>
          )}

          {/* Grid Globe - only render for ID 2 */}
          {id === 2 && <GridGlobe />}

          {/* Tech Stack - only render for ID 3 */}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {techStacks.left.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E]"></span>
                {techStacks.right.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Copy Email Button - only render for ID 6 */}
          {id === 6 && (
            <div className="mt-5 relative">
              {copied && isClient && (
                <div className="absolute -bottom-5 right-0">
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                  />
                </div>
              )}
              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses="!bg-[#161A31]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
