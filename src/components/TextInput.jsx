import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TextInput({ value, onChange, onClearAll, charCount }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl mx-auto mb-8"
        >
            <div className="relative">
                <motion.div
                    animate={{
                        scale: isFocused ? 1.02 : 1,
                        boxShadow: isFocused
                            ? '0 20px 60px -15px rgba(14, 165, 233, 0.3)'
                            : '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Type or paste any text here to detect its language..."
                        className="w-full h-64 px-6 py-5 text-lg bg-white/80 backdrop-blur-md border-2 border-primary-200/50 rounded-3xl focus:outline-none focus:border-primary-500 transition-all duration-300 resize-none placeholder-gray-400 shadow-lg"
                        style={{
                            fontFamily: 'inherit',
                        }}
                    />

                    {/* Animated border gradient */}
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-20 -z-10 blur-xl"
                            style={{ transform: 'scale(1.05)' }}
                        />
                    )}
                </motion.div>

                {/* Character count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: charCount > 0 ? 1 : 0 }}
                    className="absolute -bottom-8 right-4 text-sm text-gray-500 font-medium"
                >
                    {charCount} character{charCount !== 1 ? 's' : ''}
                </motion.div>
            </div>

            {/* Clear All button - Modern & Stylish */}
            {value && (
                <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClearAll}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2 mx-auto group"
                >
                    <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                    Clear All
                    <motion.span
                        className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                        initial={false}
                    />
                </motion.button>
            )}
        </motion.div>
    );
}
