import React, { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev < 3 ? prev + 1 : 1));
    }, 1200); // Even faster timing - 1.2 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-20">
      <h1 className="heading">
        Our <span className="text-purple">Approach</span>
      </h1>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        {CARDS_DATA.map((card, index) => (
          <ApproachCard
            key={card.title}
            {...card}
            isActive={activePhase >= index + 1}
            phase={index + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default Approach;

const CARDS_DATA = [
  {
    title: "Planning & Strategy",
    des: "We work closely with you to craft a results-driven digital strategy tailored to your business goals. From defining your target audience and selecting the right marketing channels to structuring your website and implementing AI-driven automation, we lay the foundation for a powerful online presence. Our approach ensures transparency, fairness, and a focus on client satisfaction at every step.",
    canvasProps: {
      animationSpeed: 5.1,
      containerClassName: "bg-emerald-900 rounded-3xl overflow-hidden",
    },
  },
  {
    title: "Execution & Optimization",
    des: "We bring your digital strategy to life with precision and efficiency. Whether it's launching high-converting ad campaigns, executing influencer collaborations, optimizing websites for peak performance, or automating workflows with AI, we ensure seamless execution. Our focus is on continuous improvement—analyzing results and refining strategies to maximize impact and efficiency.",
    canvasProps: {
      animationSpeed: 4,
      containerClassName: "bg-pink-900 rounded-3xl overflow-hidden",
      colors: [
        [255, 166, 158],
        [221, 255, 247],
      ],
      dotSize: 2,
    },
  },
  {
    title: "Analytics & Growth",
    des: "Data is at the core of every successful digital strategy. We track key performance metrics across marketing campaigns, website traffic, SEO rankings, and automation workflows to identify opportunities for growth. By leveraging data-driven insights, we fine-tune strategies to boost engagement, enhance conversions, and drive long-term success.",
    canvasProps: {
      animationSpeed: 4,
      containerClassName: "bg-sky-600 rounded-3xl overflow-hidden",
      colors: [[125, 211, 252]],
    },
  },
];

const ApproachCard = memo(
  ({
    title,
    des,
    canvasProps,
    isActive,
    phase,
  }: {
    title: string;
    des: string;
    canvasProps: any;
    isActive: boolean;
    phase: number;
  }) => {
    const renderIcon = useCallback(
      () => <AceternityIcon order={`Phase ${phase}`} />,
      [phase]
    );

    return (
      <div
        className="border border-black/[0.2] group/canvas-card flex items-center justify-center
       dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] h-[25rem] rounded-3xl 
       transition-all duration-300"
        style={{
          background: "rgb(4,7,29)",
          backgroundColor:
            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        }}
      >
        <CornerIcons />

        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full absolute inset-0"
            >
              <CanvasRevealEffect {...canvasProps} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20 px-4 lg:px-10">
          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
              min-w-40 mx-auto flex items-center justify-center"
              >
                {renderIcon()}
              </motion.div>
            ) : (
              <CardContent title={title} des={des} />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

const CardContent = memo(({ title, des }: { title: string; des: string }) => (
  <motion.div initial="hidden" animate="visible" variants={contentVariants}>
    <motion.h2
      variants={itemVariants}
      className="dark:text-white text-center text-xl lg:text-3xl
      relative z-10 text-white mt-4 font-bold"
    >
      {title}
    </motion.h2>
    <motion.p
      variants={itemVariants}
      className="text-xs lg:text-sm relative z-10 mt-4 text-center"
      style={{ color: "#E4ECFF" }}
    >
      {des}
    </motion.p>
  </motion.div>
));

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const CornerIcons = memo(() => (
  <>
    <Icon className="absolute h-10 w-10 -top-3 -left-3 dark:text-white text-black opacity-30" />
    <Icon className="absolute h-10 w-10 -bottom-3 -left-3 dark:text-white text-black opacity-30" />
    <Icon className="absolute h-10 w-10 -top-3 -right-3 dark:text-white text-black opacity-30" />
    <Icon className="absolute h-10 w-10 -bottom-3 -right-3 dark:text-white text-black opacity-30" />
  </>
));

const AceternityIcon = memo(({ order }: { order: string }) => (
  <div>
    <button className="relative inline-flex overflow-hidden rounded-full p-[1px]">
      <span
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
        bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
      />
      <span
        className="inline-flex h-full w-full cursor-pointer items-center 
        justify-center rounded-full bg-slate-950 px-3 lg:px-5 py-1 lg:py-2 text-purple backdrop-blur-3xl font-bold text-lg lg:text-2xl"
      >
        {order}
      </span>
    </button>
  </div>
));

export const Icon = memo(({ className, ...rest }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
));
