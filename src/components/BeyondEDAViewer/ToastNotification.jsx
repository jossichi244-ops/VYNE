// src/components/ToastNotification.jsx (FILE MỚI)

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy } from 'lucide-react';

const ToastNotification = ({ message, type, isVisible, onClose }) => {
    // Tự động đóng sau 3 giây
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 1000); 
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const icon = type === 'success' ? <CheckCircle size={20} /> : <Copy size={20} />;
    const bgColor = type === 'success' ? '#2e7d32' : '#1e3a8a';
    const borderColor = type === 'success' ? '#4caf50' : '#3b82f6';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="toast-container"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 200 }} // Trượt ra ngoài khi đóng
                    transition={{ duration: 0.3 }}
                    style={{ 
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        zIndex: 1000,
                        padding: '12px 20px',
                        borderRadius: '8px',
                        backgroundColor: bgColor,
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        borderLeft: `5px solid ${borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    {icon}
                    <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ToastNotification;