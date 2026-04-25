"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface AnimatedCardStackProps {
  cards: CardData[];
  className?: string;
}

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
];

const exitAnimation = {
  y: 340,
  scale: 1,
  zIndex: 10,
};

const enterAnimation = {
  y: -16,
  scale: 0.9,
};

function CardContent({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="-outline-offset-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-border">
        <img
          src={image}
          alt={title}
          className="h-full w-full select-none object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-foreground">{title}</span>
          <span className="text-muted-foreground text-sm">{description}</span>
        </div>
        <button className="btn-accent flex h-10 shrink-0 items-center gap-0.5 rounded-full pl-4 pr-3 text-sm font-medium">
          View
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          >
            <path d="M9.5 18L15.5 12L9.5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AnimatedCard({
  card,
  index,
  isAnimating,
}: {
  card: CardData;
  index: number;
  isAnimating: boolean;
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2];
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index;

  const exitAnim = index === 0 ? exitAnimation : undefined;
  const initialAnim = index === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0,
      }}
      style={{
        zIndex,
        left: "50%",
        x: "-50%",
        bottom: 0,
      }}
      className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-border bg-card p-1 shadow-lg will-change-transform sm:w-[512px]"
    >
      <CardContent title={card.title} description={card.description} image={card.image} />
    </motion.div>
  );
}

export default function AnimatedCardStack({ cards, className }: AnimatedCardStackProps) {
  const [currentCards, setCurrentCards] = useState(cards.slice(0, 3));
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(3);

  const handleAnimate = () => {
    if (cards.length <= 3) return;
    
    setIsAnimating(true);
    const nextIndex = currentIndex % cards.length;
    const nextCard = cards[nextIndex];
    
    setCurrentCards([...currentCards.slice(1), { ...nextCard, id: Date.now() }]);
    setCurrentIndex((prev) => prev + 1);
    setIsAnimating(false);
  };

  return (
    <div className={`flex w-full flex-col items-center justify-center pt-2 ${className || ""}`}>
      <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
        <AnimatePresence initial={false}>
          {currentCards.slice(0, 3).map((card, index) => (
            <AnimatedCard key={card.id} card={card} index={index} isAnimating={isAnimating} />
          ))}
        </AnimatePresence>
      </div>

      {cards.length > 3 && (
        <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-border py-4">
          <button
            onClick={handleAnimate}
            className="flex h-9 cursor-pointer select-none items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-background px-4 font-medium text-secondary-foreground transition-all hover:bg-secondary active:scale-[0.98]"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}
