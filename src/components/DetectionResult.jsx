import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DetectionResult({ result }) {
    const [displayedConfidence, setDisplayedConfidence] = useState(0);

    useEffect(() => {
        if (result && result.confidence) {
            // Animate the confidence number
            let current = 0;
            const target = result.confidence;
            const increment = target / 30;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setDisplayedConfidence(target);
                    clearInterval(timer);
                } else {
                    setDisplayedConfidence(Math.floor(current));
                }
            }, 20);

            return () => clearInterval(timer);
        } else {
            setDisplayedConfidence(0);
        }
    }, [result?.confidence]);

    if (!result) return null;

    const getConfidenceColor = (confidence) => {
        if (confidence >= 80) return 'from-green-500 to-emerald-600';
        if (confidence >= 60) return 'from-yellow-500 to-orange-500';
        return 'from-orange-500 to-red-500';
    };

    const getConfidenceLabel = (confidence) => {
        if (confidence >= 80) return 'High Confidence';
        if (confidence >= 60) return 'Medium Confidence';
        return 'Low Confidence';
    };

    const getConfidenceBgColor = (confidence) => {
        if (confidence >= 80) return 'bg-green-50';
        if (confidence >= 60) return 'bg-yellow-50';
        return 'bg-orange-50';
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={result.code}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-4xl mx-auto"
            >
                {result.message ? (
                    // Error or insufficient text message
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 px-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200"
                    >
                        <span className="text-5xl mb-4 block">{result.flag}</span>
                        <p className="text-gray-600 text-lg">{result.message}</p>
                    </motion.div>
                ) : (
                    // Detection result
                    <div className={`${getConfidenceBgColor(result.confidence)} backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-white/50 relative overflow-hidden`}>
                        {/* Animated background particles */}
                        <div className="absolute inset-0 pointer-events-none">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                    x: [0, 100, 0],
                                    y: [0, -50, 0],
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-primary-400/30 to-accent-400/30 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.2, 0.4, 0.2],
                                    x: [0, -80, 0],
                                    y: [0, 60, 0],
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-accent-400/30 to-primary-400/30 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.25, 0.45, 0.25],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
                            />
                        </div>

                        <div className="text-center mb-4 sm:mb-6 relative z-10">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 inline-block"
                            >
                                {result.flag}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-800 mb-2 px-4"
                            >
                                {result.name}
                            </motion.h2>
                        </div>

                        {/* Confidence meter */}
                        <div className="mt-6 sm:mt-8 relative z-10 px-2 sm:px-0">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                    {getConfidenceLabel(result.confidence)}
                                </span>
                                <motion.span
                                    key={displayedConfidence}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${getConfidenceColor(result.confidence)} bg-clip-text text-transparent`}
                                >
                                    {displayedConfidence}%
                                </motion.span>
                            </div>

                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.confidence}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full bg-gradient-to-r ${getConfidenceColor(result.confidence)} rounded-full relative`}
                                >
                                    <motion.div
                                        animate={{ x: [0, 100, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Detection info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 pt-6 border-t border-gray-300/50 text-center relative z-10"
                        >
                            <p className="text-sm text-gray-600">
                                ✨ Detected using advanced statistical analysis
                            </p>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
