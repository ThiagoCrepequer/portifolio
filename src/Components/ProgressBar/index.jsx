import React from 'react'
import { motion } from "framer-motion";

export default function ProgressBar({ progress, size }) {
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const textPosition = size / 2;
    const pathLength = progress / 100

    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i) => {
          const delay = 0.5;
          return {
            pathLength: pathLength,
            opacity: 1,
            transition: {
              pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
              opacity: { delay, duration: 0.01 }
            }
          };
        }
      };

    return (
        <motion.svg 
            width={size} 
            height={size + 30}
            initial="hidden"
            whileInView="visible"
        >
            <motion.circle
                className="progress-bar"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="#191c389a"
                fill="none"
            />
            <motion.circle
                className="progress-bar"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="#608bf2"
                fill="none"
                strokeDasharray={circumference}
                variants={draw}
                custom={1}
            />
            <text x="50%" y={textPosition + 70} textAnchor="middle" fill='white'>
                {progress}%
            </text>
        </motion.svg>
    );
};
