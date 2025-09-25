import { useState, useEffect, useRef } from 'react';

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const useAnimatedCounter = (end: number, duration: number = 2000, startInView: boolean = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!startInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      const easedT = easeOutCubic(t);
      const currentCount = Math.floor(easedT * end);
      
      setCount(currentCount);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, startInView]);

  return count;
};