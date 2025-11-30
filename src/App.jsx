import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import ImageUpload from './components/ImageUpload';
import DetectionResult from './components/DetectionResult';
import LanguageStats from './components/LanguageStats';
import BackgroundAnimation from './components/BackgroundAnimation';
import { detectLanguage } from './utils/languageDetector';
import './App.css';

function App() {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [detectionCount, setDetectionCount] = useState(0);
    const [imageKey, setImageKey] = useState(0); // Key to force ImageUpload reset
    const resultRef = useRef(null); // Reference to scroll to result

    // Debounced language detection
    useEffect(() => {
        if (!text || text.trim().length === 0) {
            setResult(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const detection = await detectLanguage(text);
            setResult(detection);

            // Increment detection count only for successful detections
            if (detection.code !== 'und' && !detection.message) {
                setDetectionCount(prev => prev + 1);
            }
        }, 500); // Debounce delay of 500ms

        return () => clearTimeout(timeoutId);
    }, [text]);

    // Auto-scroll to result when it appears
    useEffect(() => {
        if (result && resultRef.current) {
            setTimeout(() => {
                resultRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 300); // Small delay for animation
        }
    }, [result]);

    const handleTextChange = useCallback((newText) => {
        setText(newText);
    }, []);

    const handleImageTextExtracted = useCallback((extractedText) => {
        setText(extractedText);
    }, []);

    // Clear both text and image and scroll to top
    const handleClearAll = useCallback(() => {
        setText('');
        setImageKey(prev => prev + 1); // Change key to reset ImageUpload

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className="min-h-screen relative">
            <BackgroundAnimation hasResult={!!result} />

            <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                <Header />

                <main className="space-y-6 sm:space-y-8">
                    <TextInput
                        value={text}
                        onChange={handleTextChange}
                        onClearAll={handleClearAll}
                        charCount={text.length}
                    />

                    <ImageUpload
                        key={imageKey}
                        onTextExtracted={handleImageTextExtracted}
                        onClearImage={handleClearAll}
                    />

                    <div ref={resultRef}>
                        <DetectionResult result={result} />
                    </div>

                    {/* Clear All button after result */}
                    {(text || result) && (
                        <div className="flex justify-center">
                            <button
                                onClick={handleClearAll}
                                className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2 hover:scale-105"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                            </button>
                        </div>
                    )}

                    <LanguageStats detectionCount={detectionCount} />
                </main>

                <footer className="text-center mt-12 sm:mt-14 md:mt-16 pb-6 sm:pb-8 px-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                        Made with ❤️ using React, Tailwind CSS, and Google Translate API
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default App;
