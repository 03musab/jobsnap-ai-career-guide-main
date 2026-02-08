'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface DashboardRevealProps {
    scrollProgress: MotionValue<number>;
}

// Application card data
const applicationCards = [
    { id: 1, company: 'TechCorp AI', role: 'Senior ML Engineer', status: 'Interview', statusColor: 'bg-cyan-500', match: 95 },
    { id: 2, company: 'DataFlow Inc', role: 'Data Scientist', status: 'Applied', statusColor: 'bg-blue-500', match: 89 },
    { id: 3, company: 'CloudScale', role: 'AI Research Lead', status: 'Review', statusColor: 'bg-purple-500', match: 92 },
    { id: 4, company: 'NeuralWorks', role: 'Deep Learning Eng', status: 'Offered', statusColor: 'bg-emerald-500', match: 97 },
];

// AI recommendations
const recommendations = [
    { id: 1, text: 'Update resume with recent ML projects', priority: 'high' },
    { id: 2, text: 'Prepare for TechCorp system design', priority: 'medium' },
    { id: 3, text: 'Complete skill assessment', priority: 'low' },
];

// Stats data
const stats = [
    { label: 'Applications', value: 24, change: '+8' },
    { label: 'Interviews', value: 6, change: '+2' },
    { label: 'Response Rate', value: '68%', change: '+12%' },
];

// Progress ring component
const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#06b6d4' }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="progress-ring" width={size} height={size}>
                <circle
                    stroke="rgba(255,255,255,0.1)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="progress-ring__circle"
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        filter: `drop-shadow(0 0 10px ${color})`,
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">{progress}%</span>
                <span className="text-xs text-white/60">Complete</span>
            </div>
        </div>
    );
};

export default function DashboardReveal({ scrollProgress }: DashboardRevealProps) {
    // Dashboard transforms
    const dashboardScale = useTransform(scrollProgress, [0.55, 0.7, 0.85], [0.85, 1, 1]);
    const dashboardOpacity = useTransform(scrollProgress, [0.55, 0.7, 0.85], [0, 1, 1]);
    const dashboardBlur = useTransform(scrollProgress, [0.55, 0.7], [10, 0]);
    const dashboardY = useTransform(scrollProgress, [0.55, 0.7, 0.85], [50, 0, 0]);

    // Staggered reveal for cards
    const card1Opacity = useTransform(scrollProgress, [0.65, 0.72], [0, 1]);
    const card2Opacity = useTransform(scrollProgress, [0.68, 0.75], [0, 1]);
    const card3Opacity = useTransform(scrollProgress, [0.71, 0.78], [0, 1]);
    const card4Opacity = useTransform(scrollProgress, [0.74, 0.81], [0, 1]);
    const cardOpacities = [card1Opacity, card2Opacity, card3Opacity, card4Opacity];

    // Side panels
    const leftPanelX = useTransform(scrollProgress, [0.65, 0.8], [-100, 0]);
    const rightPanelX = useTransform(scrollProgress, [0.65, 0.8], [100, 0]);
    const sidePanelOpacity = useTransform(scrollProgress, [0.65, 0.8], [0, 1]);

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center p-8"
            style={{
                scale: dashboardScale,
                opacity: dashboardOpacity,
                filter: useTransform(dashboardBlur, (v) => `blur(${v}px)`),
                y: dashboardY,
            }}
        >
            <div className="w-full max-w-6xl grid grid-cols-12 gap-4">
                {/* Left Panel - AI Recommendations */}
                <motion.div
                    className="col-span-3 glass p-5 h-fit"
                    style={{
                        x: leftPanelX,
                        opacity: sidePanelOpacity,
                    }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-white">AI Insights</h3>
                    </div>
                    <div className="space-y-3">
                        {recommendations.map((rec, idx) => (
                            <motion.div
                                key={rec.id}
                                className="p-3 rounded-lg bg-white/5 border border-white/5"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + idx * 0.1 }}
                            >
                                <div className="flex items-start gap-2">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${rec.priority === 'high' ? 'bg-red-400' :
                                            rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                                        }`} />
                                    <p className="text-sm text-white/80">{rec.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Center - Application Cards Grid */}
                <div className="col-span-6 space-y-4">
                    {/* Header */}
                    <motion.div
                        className="flex items-center justify-between"
                        style={{ opacity: dashboardOpacity }}
                    >
                        <h2 className="text-xl font-semibold text-white heading-display">Your Applications</h2>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live tracking</span>
                        </div>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {applicationCards.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                className="dashboard-card p-4"
                                style={{ opacity: cardOpacities[idx] }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium text-white">{card.company}</h4>
                                        <p className="text-sm text-white/60">{card.role}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${card.statusColor} text-white`}>
                                        {card.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${card.match}%` }}
                                            transition={{ delay: 1 + idx * 0.1, duration: 0.8 }}
                                        />
                                    </div>
                                    <span className="text-xs text-cyan-400 font-medium">{card.match}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Row */}
                    <motion.div
                        className="grid grid-cols-3 gap-4"
                        style={{ opacity: useTransform(scrollProgress, [0.75, 0.85], [0, 1]) }}
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} className="glass-light p-4 text-center">
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-white/60 mb-1">{stat.label}</div>
                                <div className="text-xs text-emerald-400">{stat.change}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Panel - Progress */}
                <motion.div
                    className="col-span-3 glass p-5 h-fit"
                    style={{
                        x: rightPanelX,
                        opacity: sidePanelOpacity,
                    }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-white">Interview Progress</h3>
                    </div>

                    <div className="flex justify-center mb-6">
                        <ProgressRing progress={75} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Technical</span>
                            <span className="text-emerald-400">Passed</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">System Design</span>
                            <span className="text-cyan-400">Scheduled</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Behavioral</span>
                            <span className="text-white/40">Pending</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Final Round</span>
                            <span className="text-white/40">Pending</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
