import { motion } from 'framer-motion';

export default function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12 pt-12"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block"
            >
                <h1 className="text-6xl md:text-7xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    AI Language Detector
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 font-medium"
            >
                Detect any language instantly with AI-powered precision
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 flex items-center justify-center gap-2"
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200/50 shadow-sm">
                    <span className="text-2xl">🤖</span>
                    <span className="text-sm font-semibold text-gray-700">Powered by AI</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-accent-200/50 shadow-sm">
                    <span className="text-2xl">🌍</span>
                    <span className="text-sm font-semibold text-gray-700">300+ Languages</span>
                </div>
            </motion.div>
        </motion.header>
    );
}
