import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000); // Change phase every 2 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-20">
      <h1 className="heading">
        Our <span className="text-purple">Approach</span>
      </h1>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title="Planning & Strategy"
          icon={<AceternityIcon order="Phase 1" />}
          des="We work closely with you to craft a results-driven digital strategy tailored to your business goals. From defining your target audience and selecting the right marketing channels to structuring your website and implementing AI-driven automation, we lay the foundation for a powerful online presence. Our approach ensures transparency, fairness, and a focus on client satisfaction at every step."
          isActive={activePhase >= 1}
          phase={1}
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900 rounded-3xl overflow-hidden"
          />
        </Card>
        <Card
          title="Execution & Optimization"
          icon={<AceternityIcon order="Phase 2" />}
          des="We bring your digital strategy to life with precision and efficiency. Whether it's launching high-converting ad campaigns, executing influencer collaborations, optimizing websites for peak performance, or automating workflows with AI, we ensure seamless execution. Our focus is on continuous improvement—analyzing results and refining strategies to maximize impact and efficiency."
          isActive={activePhase >= 2}
          phase={2}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-pink-900 rounded-3xl overflow-hidden"
            colors={[
              [255, 166, 158],
              [221, 255, 247],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title="Analytics & Growth"
          icon={<AceternityIcon order="Phase 3" />}
          des="Data is at the core of every successful digital strategy. We track key performance metrics across marketing campaigns, website traffic, SEO rankings, and automation workflows to identify opportunities for growth. By leveraging data-driven insights, we fine-tune strategies to boost engagement, enhance conversions, and drive long-term success."
          isActive={activePhase >= 3}
          phase={3}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600 rounded-3xl overflow-hidden"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  icon,
  children,
  des,
  isActive,
  phase,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
  isActive: boolean;
  phase: number;
}) => {
  return (
    <div
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center
       dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl"
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <Icon className="absolute h-10 w-10 -top-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -top-3 -right-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -right-3 dark:text-white text-black opacity-30" />

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 px-10">
        <AnimatePresence>
          {!isActive && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
              min-w-40 mx-auto flex items-center justify-center"
            >
              {icon}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isActive && (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="dark:text-white text-center text-3xl
                relative z-10 text-white mt-4 font-bold"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm relative z-10 mt-4 text-center"
                style={{ color: "#E4ECFF" }}
              >
                {des}
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button className="relative inline-flex overflow-hidden rounded-full p-[1px] ">
        <span
          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
         bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
        />
        <span
          className="inline-flex h-full w-full cursor-pointer items-center 
        justify-center rounded-full bg-slate-950 px-5 py-2 text-purple backdrop-blur-3xl font-bold text-2xl"
        >
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
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
  );
};
