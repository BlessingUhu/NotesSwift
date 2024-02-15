"use client";

import {motion} from "framer-motion";
import styles from "./styles/Loading.module.scss";

export default function Loading() {
  const draw = {
    hidden: {pathLength: 0, opacity: 0},
    visible: (i: number) => {
      const delay = 0;
      return {
        pathLength: 1,
        opacity: 3,
        transition: {
          pathLength: {delay, type: "spring", duration: 1, bounce: 0},
          opacity: {delay, duration: 0.5},
        },
      };
    },
  };
  return (
    <>
      <div className={styles.loading}>
        <div className={styles.loading_wrapper}>
          <h3>Feeding unicorns...</h3>
          <div className={styles.circle_wrapper}>
            <motion.svg width="200" height="200" viewBox="0 0 400 200" initial="hidden" animate="visible">
              <motion.circle cx="100" cy="100" r="80" stroke="#b1fab5" variants={draw} custom={1} />
            </motion.svg>
          </div>
        </div>
      </div>
    </>
  );
}
