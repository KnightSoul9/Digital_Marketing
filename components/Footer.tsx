"use client";

import React, { memo } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

// Memoized social media link component
const SocialMediaLink = memo(
  ({ id, link, img }: { id: number; link: string; img: string }) => (
    <a
      key={id}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
    >
      <Image
        src={img}
        alt={`social-media-${id}`}
        width={20}
        height={20}
        loading="lazy"
      />
    </a>
  )
);

SocialMediaLink.displayName = "SocialMediaLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-20 pb-10 relative" id="contact">
      {/* Background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <Image
          src="/footer-grid.svg"
          alt="Footer background grid"
          fill
          sizes="100vw"
          priority={false}
          className="opacity-50 object-cover"
        />
      </div>

      <div className="flex flex-col items-center relative z-10">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:business.boostuponline@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center relative z-10">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © {currentYear} BoostUp Media, Inc. All Rights Reserved.
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <SocialMediaLink
              key={info.id}
              id={info.id}
              link={info.link}
              img={info.img}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
