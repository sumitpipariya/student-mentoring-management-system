"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const iconStyles = {
        success: 'check_circle',
        error: 'error',
        info: 'info'
    };

    const colorStyles = {
        success: { bg: '#d1fae5', text: '#065f46', iconBg: '#10b981' },
        error: { bg: '#ffe4e6', text: '#9f1239', iconBg: '#e11d48' },
        info: { bg: '#dbeafe', text: '#1e40af', iconBg: '#3b82f6' }
    };

    const currentTheme = colorStyles[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="position-fixed"
                    style={{
                        top: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="d-flex align-items-center gap-3 p-3 rounded-4 shadow-lg border"
                        style={{
                            backgroundColor: 'white',
                            minWidth: '320px',
                            borderLeft: `5px solid ${currentTheme.iconBg}`
                        }}
                    >
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: currentTheme.bg,
                                color: currentTheme.iconBg
                            }}
                        >
                            <span className="material-symbols-rounded">{iconStyles[type]}</span>
                        </div>

                        <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>
                                {type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Information'}
                            </h6>
                            <div className="small fw-medium" style={{ color: '#64748b' }}>
                                {message}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="btn btn-sm d-flex align-items-center justify-content-center p-1 flex-shrink-0"
                            style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}
                        >
                            <span className="material-symbols-rounded">close</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
