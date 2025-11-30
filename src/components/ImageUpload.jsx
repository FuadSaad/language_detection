import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ImageUpload({ onTextExtracted, onClearImage }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processImage(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    };

    const processImage = async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setError(null);
        setIsProcessing(true);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // Prepare form data for OCR API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('apikey', 'helloworld'); // Free public API key
        formData.append('language', 'eng'); // English language
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true'); // Improve accuracy
        formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

        try {
            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.OCRExitCode === 1 && result.ParsedResults && result.ParsedResults.length > 0) {
                const extractedText = result.ParsedResults[0].ParsedText;

                if (extractedText && extractedText.trim()) {
                    onTextExtracted(extractedText.trim());
                    setError(null);
                } else {
                    setError('No text found in the image');
                }
            } else {
                setError('Failed to extract text. Please try another image.');
            }
        } catch (err) {
            console.error('OCR Error:', err);
            setError('OCR service error. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const clearImage = () => {
        setPreviewUrl(null);
        setError(null);
        if (onClearImage) {
            onClearImage();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-4xl mx-auto mb-8"
        >
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Or Upload an Image
                </h3>
            </div>

            {!previewUrl ? (
                <motion.div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.02 }}
                    className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer ${isDragging
                        ? 'border-primary-500 bg-primary-50/50 scale-105'
                        : 'border-gray-300 bg-gray-50/50 hover:border-primary-400'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="text-center">
                        <motion.div
                            animate={{
                                y: isDragging ? -10 : 0,
                                scale: isDragging ? 1.1 : 1,
                            }}
                            className="mx-auto w-16 h-16 mb-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center"
                        >
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </motion.div>

                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isDragging ? 'Drop image here!' : 'Drag & drop image here'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                        <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF, BMP</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg"
                >
                    <img
                        src={previewUrl}
                        alt="Uploaded preview"
                        className="w-full max-h-64 object-contain rounded-2xl mb-4"
                    />

                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full"
                                />
                                <p className="text-lg font-semibold text-gray-700">Extracting text from image...</p>
                            </div>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearImage}
                        className="w-full px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove Image
                    </motion.button>
                </motion.div>
            )}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
