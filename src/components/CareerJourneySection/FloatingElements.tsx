'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { useMemo } from 'react';

// Floating element type
export type FloatingItem = {
  id: number;
  icon: 'resume' | 'notification' | 'search' | 'job-card' | 'email' | 'message' | 'document' | 'tag' | 'star' | 'briefcase' | 'chart' | 'calendar';
  depth: number; // 1-3, affects size and blur
  initialX: number; // percentage
  initialY: number; // percentage
  rotation: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: 'cyan' | 'purple' | 'blue' | 'white';
};

// Icon components
const ResumeIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="8" y="4" width="32" height="40" rx="4" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <circle cx="24" cy="16" r="6" stroke={color} strokeWidth="2"/>
    <path d="M14 34h20M14 40h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <rect x="14" y="26" width="20" height="2" fill={color} opacity="0.5"/>
  </svg>
);

const NotificationIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <path d="M24 4C17.373 4 12 9.373 12 16v10l-4 4v2h32v-2l-4-4V16c0-6.627-5.373-12-12-12z" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <circle cx="24" cy="42" r="4" fill={color}/>
    <circle cx="36" cy="10" r="6" fill="#ef4444"/>
  </svg>
);

const SearchIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <circle cx="20" cy="20" r="12" stroke={color} strokeWidth="3" fill="rgba(255,255,255,0.05)"/>
    <path d="M30 30l12 12" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const JobCardIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
    <rect x="2" y="2" width="60" height="44" rx="8" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="8" y="8" width="20" height="20" rx="4" fill={color} opacity="0.3"/>
    <path d="M34 12h22M34 20h16M34 28h20" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <rect x="8" y="34" width="48" height="6" rx="3" fill={color} opacity="0.2"/>
  </svg>
);

const EmailIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 36" fill="none" className="w-full h-full">
    <rect x="2" y="2" width="44" height="32" rx="4" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <path d="M4 6l20 14 20-14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MessageIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <path d="M4 8a4 4 0 014-4h32a4 4 0 014 4v24a4 4 0 01-4 4H16l-8 8v-8H8a4 4 0 01-4-4V8z" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <circle cx="16" cy="20" r="3" fill={color}/>
    <circle cx="24" cy="20" r="3" fill={color}/>
    <circle cx="32" cy="20" r="3" fill={color}/>
  </svg>
);

const DocumentIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 40 48" fill="none" className="w-full h-full">
    <path d="M4 4a4 4 0 014-4h18l10 10v34a4 4 0 01-4 4H8a4 4 0 01-4-4V4z" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <path d="M26 0v10h10" stroke={color} strokeWidth="2"/>
    <path d="M10 20h20M10 28h16M10 36h12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const TagIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <path d="M4 8a4 4 0 014-4h16l20 20-16 16-20-20V8z" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <circle cx="14" cy="14" r="4" fill={color}/>
  </svg>
);

const StarIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <path d="M24 4l6 12 13.5 2-9.75 9.5L36 41l-12-6.3L12 41l2.25-13.5L4.5 18l13.5-2L24 4z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2"/>
  </svg>
);

const BriefcaseIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 40" fill="none" className="w-full h-full">
    <rect x="4" y="10" width="40" height="26" rx="4" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <path d="M16 10V6a2 2 0 012-2h12a2 2 0 012 2v4" stroke={color} strokeWidth="2"/>
    <path d="M4 20h40" stroke={color} strokeWidth="2" opacity="0.5"/>
  </svg>
);

const ChartIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="4" y="4" width="40" height="40" rx="4" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="10" y="28" width="6" height="12" fill={color} opacity="0.6"/>
    <rect x="21" y="18" width="6" height="22" fill={color} opacity="0.8"/>
    <rect x="32" y="10" width="6" height="30" fill={color}/>
  </svg>
);

const CalendarIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="4" y="8" width="40" height="36" rx="4" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.05)"/>
    <path d="M4 18h40" stroke={color} strokeWidth="2"/>
    <path d="M14 4v8M34 4v8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="28" r="3" fill={color} opacity="0.5"/>
    <circle cx="24" cy="28" r="3" fill={color}/>
    <circle cx="32" cy="28" r="3" fill={color} opacity="0.5"/>
    <circle cx="16" cy="38" r="3" fill={color} opacity="0.3"/>
  </svg>
);

const iconMap = {
  'resume': ResumeIcon,
  'notification': NotificationIcon,
  'search': SearchIcon,
  'job-card': JobCardIcon,
  'email': EmailIcon,
  'message': MessageIcon,
  'document': DocumentIcon,
  'tag': TagIcon,
  'star': StarIcon,
  'briefcase': BriefcaseIcon,
  'chart': ChartIcon,
  'calendar': CalendarIcon,
};

const colorMap = {
  cyan: '#06b6d4',
  purple: '#a855f7',
  blue: '#3b82f6',
  white: '#f0f4f8',
};

// Generate floating items
export const floatingItems: FloatingItem[] = [
  { id: 1, icon: 'resume', depth: 1, initialX: 15, initialY: 20, rotation: -15, orbitRadius: 30, orbitSpeed: 20, color: 'cyan' },
  { id: 2, icon: 'notification', depth: 2, initialX: 80, initialY: 15, rotation: 12, orbitRadius: 25, orbitSpeed: 25, color: 'purple' },
  { id: 3, icon: 'search', depth: 1, initialX: 70, initialY: 65, rotation: -8, orbitRadius: 35, orbitSpeed: 18, color: 'blue' },
  { id: 4, icon: 'job-card', depth: 2, initialX: 25, initialY: 70, rotation: 20, orbitRadius: 40, orbitSpeed: 22, color: 'cyan' },
  { id: 5, icon: 'email', depth: 3, initialX: 85, initialY: 45, rotation: -25, orbitRadius: 20, orbitSpeed: 30, color: 'white' },
  { id: 6, icon: 'message', depth: 1, initialX: 10, initialY: 50, rotation: 8, orbitRadius: 28, orbitSpeed: 24, color: 'purple' },
  { id: 7, icon: 'document', depth: 2, initialX: 60, initialY: 25, rotation: -18, orbitRadius: 32, orbitSpeed: 19, color: 'blue' },
  { id: 8, icon: 'tag', depth: 3, initialX: 40, initialY: 80, rotation: 30, orbitRadius: 22, orbitSpeed: 28, color: 'cyan' },
  { id: 9, icon: 'star', depth: 1, initialX: 90, initialY: 75, rotation: -5, orbitRadius: 26, orbitSpeed: 21, color: 'purple' },
  { id: 10, icon: 'briefcase', depth: 2, initialX: 5, initialY: 35, rotation: 15, orbitRadius: 38, orbitSpeed: 17, color: 'blue' },
  { id: 11, icon: 'chart', depth: 3, initialX: 50, initialY: 10, rotation: -22, orbitRadius: 24, orbitSpeed: 26, color: 'white' },
  { id: 12, icon: 'calendar', depth: 1, initialX: 35, initialY: 55, rotation: 10, orbitRadius: 34, orbitSpeed: 23, color: 'cyan' },
  { id: 13, icon: 'resume', depth: 3, initialX: 75, initialY: 40, rotation: -12, orbitRadius: 18, orbitSpeed: 32, color: 'purple' },
  { id: 14, icon: 'notification', depth: 1, initialX: 20, initialY: 85, rotation: 25, orbitRadius: 36, orbitSpeed: 16, color: 'blue' },
  { id: 15, icon: 'search', depth: 2, initialX: 55, initialY: 50, rotation: -28, orbitRadius: 30, orbitSpeed: 20, color: 'cyan' },
  { id: 16, icon: 'job-card', depth: 3, initialX: 45, initialY: 30, rotation: 18, orbitRadius: 20, orbitSpeed: 29, color: 'white' },
];

// Target positions for convergence (dashboard grid positions)
const targetPositions = [
  { x: 25, y: 30 }, { x: 50, y: 30 }, { x: 75, y: 30 },
  { x: 25, y: 50 }, { x: 50, y: 50 }, { x: 75, y: 50 },
  { x: 25, y: 70 }, { x: 50, y: 70 }, { x: 75, y: 70 },
  { x: 35, y: 40 }, { x: 65, y: 40 }, { x: 35, y: 60 },
  { x: 65, y: 60 }, { x: 50, y: 40 }, { x: 50, y: 60 },
  { x: 50, y: 50 },
];

interface FloatingElementProps {
  item: FloatingItem;
  scrollProgress: MotionValue<number>;
  time: number;
}

const FloatingElement = ({ item, scrollProgress, time }: FloatingElementProps) => {
  const IconComponent = iconMap[item.icon];
  const color = colorMap[item.color];
  
  // Size based on depth
  const baseSize = item.depth === 1 ? 80 : item.depth === 2 ? 60 : 45;
  
  // Blur based on depth
  const blur = item.depth === 1 ? 0 : item.depth === 2 ? 1 : 3;
  
  // Calculate orbital motion
  const orbitAngle = (time / item.orbitSpeed) * Math.PI * 2;
  const orbitX = Math.cos(orbitAngle) * item.orbitRadius;
  const orbitY = Math.sin(orbitAngle) * item.orbitRadius * 0.5; // Elliptical orbit
  
  // Get target position for this item
  const targetPos = targetPositions[item.id % targetPositions.length];
  
  // Transform values based on scroll progress
  const x = useTransform(
    scrollProgress,
    [0, 0.4, 0.7, 1],
    [
      item.initialX + orbitX * 0.5,
      item.initialX * 0.5 + 25 + orbitX * 0.2,
      targetPos.x,
      targetPos.x
    ]
  );
  
  const y = useTransform(
    scrollProgress,
    [0, 0.4, 0.7, 1],
    [
      item.initialY + orbitY * 0.5,
      item.initialY * 0.5 + 25 + orbitY * 0.2,
      targetPos.y,
      targetPos.y
    ]
  );
  
  const rotation = useTransform(
    scrollProgress,
    [0, 0.4, 0.7, 1],
    [item.rotation + Math.sin(orbitAngle) * 10, item.rotation * 0.5, 0, 0]
  );
  
  const scale = useTransform(
    scrollProgress,
    [0, 0.4, 0.7, 0.8, 1],
    [1, 0.9, 0.6, 0, 0]
  );
  
  const opacity = useTransform(
    scrollProgress,
    [0, 0.4, 0.65, 0.7, 1],
    [item.depth === 3 ? 0.6 : 0.9, 0.8, 0.5, 0, 0]
  );

  return (
    <motion.div
      className="cjs-floating-element"
      style={{
        left: useTransform(x, (v) => `${v}%`),
        top: useTransform(y, (v) => `${v}%`),
        rotate: rotation,
        scale,
        opacity,
        width: baseSize,
        height: baseSize,
        filter: `blur(${blur}px)`,
        zIndex: 4 - item.depth,
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3 + item.depth,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <IconComponent color={color} />
      </motion.div>
    </motion.div>
  );
};

interface FloatingElementsProps {
  scrollProgress: MotionValue<number>;
}

export default function FloatingElements({ scrollProgress }: FloatingElementsProps) {
  // Time-based animation state
  const time = useMemo(() => {
    return 0;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {floatingItems.map((item) => (
        <FloatingElement
          key={item.id}
          item={item}
          scrollProgress={scrollProgress}
          time={time}
        />
      ))}
    </div>
  );
}
