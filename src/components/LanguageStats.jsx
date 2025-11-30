import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getSupportedLanguagesCount } from '../utils/languageDetector';

export default function LanguageStats({ detectionCount }) {
    const [displayedCount, setDisplayedCount] = useState(0);
    const supportedLanguages = getSupportedLanguagesCount();

    useEffect(() => {
        if (detectionCount > 0) {
            let current = 0;
            const target = detectionCount;
            const increment = 1;

            const timer = setInterval(() => {
                if (current < target) {
                    current += increment;
                    setDisplayedCount(current);
                } else {
                    clearInterval(timer);
                }
            }, 50);

            return () => clearInterval(timer);
        }
    }, [detectionCount]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full max-w-4xl mx-auto mt-12 mb-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Supported Languages */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-gradient-to-br from-primary-50 to-primary-100 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-primary-200/50 shadow-lg"
                >
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌐</div>
                        <div className="text-3xl sm:text-4xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                            {supportedLanguages}+
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Supported Languages
                        </div>
                    </div>
                </motion.div>

                {/* Detections Made */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-gradient-to-br from-accent-50 to-accent-100 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-accent-200/50 shadow-lg"
                >
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✨</div>
                        <div className="text-3xl sm:text-4xl font-bold font-display bg-gradient-to-r from-accent-600 to-accent-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                            {displayedCount}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Detections Made
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center"
            >
                <p className="text-sm text-gray-500">
                    Powered by <a href="https://sites.google.com/diu.edu.bd/fuadhossain/home" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">Fuad</a> •
                    Statistical Language Detection •
                    Client-side Processing
                </p>
            </motion.div>
        </motion.div>
    );
}
