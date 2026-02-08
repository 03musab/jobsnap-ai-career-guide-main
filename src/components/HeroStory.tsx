'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FloatingElements from './FloatingElements';
import DashboardReveal from './DashboardReveal';

// Particle component for background - using deterministic values to avoid hydration mismatch
const particles = [
    { id: 0, left: 5, delay: 0, duration: 18, size: 3 },
    { id: 1, left: 12, delay: 2.5, duration: 22, size: 4 },
    { id: 2, left: 18, delay: 5, duration: 16, size: 2.5 },
    { id: 4, left: 32, delay: 7, duration: 19, size: 4.5 },
    { id: 5, left: 38, delay: 3, duration: 24, size: 3 },
    { id: 7, left: 52, delay: 4, duration: 21, size: 5 },
    { id: 9, left: 65, delay: 6, duration: 23, size: 4 },
    { id: 10, left: 72, delay: 12, duration: 16, size: 2.5 },
    { id: 12, left: 85, delay: 11, duration: 19, size: 4.5 },
    { id: 14, left: 98, delay: 13, duration: 17, size: 2 },
    { id: 16, left: 22, delay: 6.5, duration: 18, size: 3 },
    { id: 18, left: 48, delay: 9.5, duration: 16, size: 2.5 },
    { id: 20, left: 75, delay: 3.5, duration: 19, size: 3.5 },
    { id: 22, left: 15, delay: 13.5, duration: 24, size: 4.5 },
    { id: 24, left: 68, delay: 8.5, duration: 22, size: 5 },
];

const Particles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};


// Gradient orbs for depth
const GradientOrbs = () => (
    <>
        <div
            className="orb orb-purple"
            style={{
                width: '600px',
                height: '600px',
                top: '-10%',
                left: '-10%',
            }}
        />
        <div
            className="orb orb-cyan"
            style={{
                width: '500px',
                height: '500px',
                bottom: '10%',
                right: '-5%',
                animationDelay: '2s',
            }}
        />
        <div
            className="orb orb-blue"
            style={{
                width: '400px',
                height: '400px',
                top: '40%',
                left: '30%',
                animationDelay: '4s',
            }}
        />
    </>
);

export default function HeroStory() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll progress tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Stage text transforms
    const stage1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0]);
    const stage1Y = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
    const stage1Scale = useTransform(scrollYProgress, [0, 0.35], [1, 0.95]);

    const stage2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55, 0.65], [0, 1, 1, 0]);
    const stage2Y = useTransform(scrollYProgress, [0.25, 0.4, 0.65], [50, 0, -30]);

    const stage3Opacity = useTransform(scrollYProgress, [0.6, 0.75, 0.9], [0, 1, 1]);
    const stage3Y = useTransform(scrollYProgress, [0.6, 0.75], [30, 0]);

    const stage4Opacity = useTransform(scrollYProgress, [0.88, 0.95, 1], [0, 1, 1]);
    const stage4Scale = useTransform(scrollYProgress, [0.88, 0.95], [0.9, 1]);

    // Checkmark animations for final stage
    const checkmarks = [
        { delay: 0, x: -120 },
        { delay: 0.1, x: 0 },
        { delay: 0.2, x: 120 },
    ];

    return (
        <div ref={containerRef} className="scroll-container">
            {/* Hexagon grid overlay removed */}

            {/* Sticky viewport */}
            <div className="sticky-wrapper">
                {/* Background effects */}
                <GradientOrbs />
                <Particles />

                {/* Floating elements layer */}
                <FloatingElements scrollProgress={scrollYProgress} />

                {/* Dashboard reveal layer */}
                <DashboardReveal scrollProgress={scrollYProgress} />

                {/* Stage 1 - Chaos text */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    style={{
                        opacity: stage1Opacity,
                        y: stage1Y,
                        scale: stage1Scale,
                    }}
                >
                    <div className="text-center px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                        >
                            <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 text-glow">
                                Your Career Journey.
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Reimagined.
                                </span>
                            </h1>
                        </motion.div>
                        <motion.p
                            className="text-lg md:text-xl text-white/60 max-w-xl mx-auto body-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        >
                            Let AI transform your job search from chaos into clarity
                        </motion.p>
                        <motion.div
                            className="mt-8 flex items-center justify-center gap-2 text-white/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <span className="text-sm">Scroll to explore</span>
                            <motion.svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </motion.svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stage 2 - Intelligence text */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    style={{
                        opacity: stage2Opacity,
                        y: stage2Y,
                    }}
                >
                    <div className="text-center px-4">
                        <h2 className="heading-display text-4xl md:text-6xl lg:text-7xl text-white mb-4">
                            AI Organizes
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                Everything.
                            </span>
                        </h2>
                        <p className="text-lg text-white/50 max-w-md mx-auto body-text">
                            Watch chaos transform into intelligence
                        </p>
                    </div>
                </motion.div>

                {/* Stage 3 - Dashboard header (hidden, dashboard is shown) */}
                <motion.div
                    className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none z-20"
                    style={{
                        opacity: stage3Opacity,
                        y: stage3Y,
                    }}
                >
                    <div className="glass px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-sm">JobSnap AI</h3>
                                <p className="text-xs text-white/50">Your intelligent career companion</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stage 4 - Footer Completion */}
                <motion.footer
                    className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
                    style={{
                        opacity: stage4Opacity,
                    }}
                >
                    <div className="glass mx-4 mb-4 md:mx-6 px-5 py-4 md:px-6 md:py-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Left - Text */}
                            <div className="text-center md:text-left">
                                <motion.h2
                                    className="heading-display text-xl md:text-2xl text-white"
                                    style={{ scale: stage4Scale }}
                                >
                                    Your Journey.{' '}
                                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        Organized.
                                    </span>
                                </motion.h2>
                            </div>

                            {/* Center - Checkmarks */}
                            <div className="flex items-center gap-3">
                                {checkmarks.map((check, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: check.delay,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                        style={{
                                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)',
                                        }}
                                    >
                                        <motion.svg
                                            className="w-4 h-4 text-emerald-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: check.delay + 0.2, duration: 0.5 }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </motion.svg>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right - CTA Button */}
                            <motion.button
                                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium text-sm shadow-lg hover:shadow-cyan-500/25 transition-shadow pointer-events-auto whitespace-nowrap"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Your Journey
                            </motion.button>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </div>
    );

}
