"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type DialogType = 'danger' | 'success' | 'warning' | 'info';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    type?: DialogType;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    showCancel?: boolean;
}

const dialogConfig = {
    danger: {
        icon: 'delete_forever',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        iconBg: 'rgba(239, 68, 68, 0.12)',
        iconColor: '#ef4444',
        buttonBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
        buttonHover: '#dc2626',
        accentBorder: '#fca5a5',
        glowColor: 'rgba(239, 68, 68, 0.15)',
    },
    success: {
        icon: 'check_circle',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        iconColor: '#10b981',
        buttonBg: 'linear-gradient(135deg, #10b981, #059669)',
        buttonHover: '#059669',
        accentBorder: '#6ee7b7',
        glowColor: 'rgba(16, 185, 129, 0.15)',
    },
    warning: {
        icon: 'warning',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        iconColor: '#f59e0b',
        buttonBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
        buttonHover: '#d97706',
        accentBorder: '#fcd34d',
        glowColor: 'rgba(245, 158, 11, 0.15)',
    },
    info: {
        icon: 'info',
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        iconBg: 'rgba(59, 130, 246, 0.12)',
        iconColor: '#3b82f6',
        buttonBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        buttonHover: '#2563eb',
        accentBorder: '#93c5fd',
        glowColor: 'rgba(59, 130, 246, 0.15)',
    },
};

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    showCancel = true,
}: ConfirmDialogProps) {
    const config = dialogConfig[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                        zIndex: 10000,
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '420px',
                            width: '90%',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: `0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 80px ${config.glowColor}`,
                        }}
                    >
                        {/* Top Accent Bar */}
                        <div style={{
                            height: '4px',
                            background: config.gradient,
                        }} />

                        <div style={{
                            background: 'white',
                            padding: '32px',
                        }}>
                            {/* Icon Badge */}
                            <div className="d-flex justify-content-center mb-4">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: '20px',
                                        background: config.iconBg,
                                        border: `2px solid ${config.accentBorder}`,
                                    }}
                                >
                                    <span
                                        className="material-symbols-rounded"
                                        style={{
                                            fontSize: '36px',
                                            color: config.iconColor,
                                        }}
                                    >
                                        {config.icon}
                                    </span>
                                </motion.div>
                            </div>

                            {/* Title */}
                            <motion.h5
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-center fw-black mb-2"
                                style={{
                                    color: '#0f172a',
                                    fontSize: '1.25rem',
                                    letterSpacing: '-0.025em',
                                }}
                            >
                                {title}
                            </motion.h5>

                            {/* Message */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center mb-0"
                                style={{
                                    color: '#64748b',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                }}
                            >
                                {message}
                            </motion.p>
                        </div>

                        {/* Actions */}
                        <div
                            className="d-flex gap-3 p-4"
                            style={{
                                background: '#f8fafc',
                                borderTop: '1px solid #f1f5f9',
                            }}
                        >
                            {showCancel && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn flex-fill py-3 fw-bold"
                                    onClick={onCancel}
                                    style={{
                                        borderRadius: '14px',
                                        border: '2px solid #e2e8f0',
                                        background: 'white',
                                        color: '#475569',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#cbd5e1';
                                        e.currentTarget.style.background = '#f8fafc';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.background = 'white';
                                    }}
                                >
                                    {cancelText}
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: `0 8px 25px ${config.glowColor}` }}
                                whileTap={{ scale: 0.98 }}
                                className="btn flex-fill py-3 fw-bold text-white"
                                onClick={onConfirm}
                                style={{
                                    borderRadius: '14px',
                                    border: 'none',
                                    background: config.buttonBg,
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {confirmText}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
