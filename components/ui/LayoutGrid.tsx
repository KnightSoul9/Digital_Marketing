"use client";
import React, { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./MovingBorders";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

// Memoized BlurImage component to prevent unnecessary re-renders
const BlurImage = memo(({ card }: { card: Card }) => {
  const [loaded, setLoaded] = useState(false);

  // Memoize the onLoad callback
  const handleImageLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <Image
      src={card.thumbnail}
      fill
      onLoad={handleImageLoad}
      className={cn(
        "object-cover object-top absolute inset-0 h-full w-full transition duration-200",
        loaded ? "blur-none" : "blur-md"
      )}
      alt="thumbnail"
    />
  );
});

BlurImage.displayName = "BlurImage";

// Memoized SelectedCard component
const SelectedCard = memo(({ selected }: { selected: Card | null }) => {
  if (!selected) return null;

  return (
    <div className="bg-white relative z-10 flex flex-col justify-start items-start p-6 h-full w-full rounded-lg overflow-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full"
      >
        {selected.content}
      </motion.div>
    </div>
  );
});

SelectedCard.displayName = "SelectedCard";

// Main LayoutGrid component
export const LayoutGrid = memo(({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  // Memoize handlers to prevent recreation on re-renders
  const handleClick = useCallback(
    (card: Card) => {
      setLastSelected(selected);
      setSelected(card);
    },
    [selected]
  );

  const handleOutsideClick = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  // Memoize the overlay component to prevent unnecessary recreation
  const Overlay = useMemo(() => {
    if (!selected) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOutsideClick}
        className="fixed inset-0 z-40 bg-black/80"
      />
    );
  }, [selected, handleOutsideClick]);

  return (
    <div className="relative w-full h-full p-10">
      <AnimatePresence>{Overlay}</AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={`card-${card.id}`}
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden",
              selected?.id === card.id
                ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white rounded-xl h-full w-full"
                : "bg-white rounded-xl h-full w-full"
            )}
            layout
          >
            {/* Only render the SelectedCard when this card is selected */}
            {selected?.id === card.id && <SelectedCard selected={selected} />}

            {/* Optimize image loading by only showing BlurImage when card is not selected */}
            {selected?.id !== card.id && <BlurImage card={card} />}
          </motion.div>
        ))}
      </div>
    </div>
  );
});

LayoutGrid.displayName = "LayoutGrid";
