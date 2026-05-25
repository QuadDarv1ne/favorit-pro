'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfidenceGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export function ConfidenceGauge({ value, size = 48, strokeWidth = 4 }: ConfidenceGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = () => {
    if (value > 70) return '#10b981'; // emerald
    if (value >= 50) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const color = getColor();

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span
        className="absolute text-white font-bold tabular-nums"
        style={{ fontSize: size * 0.26 }}
      >
        {value}
      </span>
    </div>
  );
}
