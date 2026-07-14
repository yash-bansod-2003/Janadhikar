"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isInView = true,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView?: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.5 });
      return controls.stop;
    }
  }, [count, value, isInView]);

  return (
    <span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const WelcomeCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="flex h-full w-full items-stretch justify-center">
      <Card className="relative w-full overflow-hidden bg-blue-500 p-5 pb-0 text-white dark:bg-blue-500 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          <div className="w-full lg:flex-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <TrendingUp size={24} className="text-neutral-600" />
              </div>

              <h5 className="text-lg font-medium text-white sm:text-xl">
                Welcome Back David
              </h5>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-start sm:gap-0 lg:mt-12">
              <div className="border-b border-white/20 pb-4 sm:border-b-0 sm:border-e sm:pe-4 sm:pb-0">
                <p className="mb-1 text-sm text-white/75">Budget</p>
                <h2 className="text-2xl! font-semibold tracking-tight text-white">
                  <AnimatedCounter
                    value={98450}
                    isInView={isInView}
                    prefix="$"
                  />
                </h2>
              </div>

              <div className="sm:ps-4">
                <p className="mb-1 text-sm text-white/75">Expenses</p>
                <h2 className="text-2xl! font-semibold tracking-tight text-white">
                  <AnimatedCounter
                    value={2440}
                    isInView={isInView}
                    prefix="$"
                  />
                </h2>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center lg:w-auto lg:justify-end">
            <img
              src="https://images.shadcnspace.com/assets/backgrounds/welcome-bg-1.png"
              alt="background"
              className="w-full max-w-55 object-contain sm:max-w-60 lg:max-w-45"
              width={1024}
              height={195}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeCard;
