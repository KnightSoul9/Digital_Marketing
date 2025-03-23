"use client";

import React, { memo, useMemo } from "react";
import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

// Update interface to match the actual data structure
interface GridItem {
  id: number; // Changed from string to number based on the error
  title: string;
  description: string;
  className: string;
  img: string;
  imgClassName: string;
  titleClassName: string;
  spareImg: string; // Made non-optional since it appears to be required
}

// Memoized grid item component
const MemoizedBentoGridItem = memo(BentoGridItem);

const Grid = () => {
  // Memoize the grid items to prevent unnecessary recalculations
  const memoizedGridItems = useMemo(() => gridItems, []);

  return (
    <section id="about" className="w-full">
      <BentoGrid className="w-full py-20">
        {memoizedGridItems.map((item) => (
          <MemoizedBentoGridItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default memo(Grid);
