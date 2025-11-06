import '../assets/styles/FileUpload.scss'; 
import React, { useRef, useState } from 'react';

const FileUpload = ({ onFileChange, onUpload, loading, error }) => {
    const fileInputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            onFileChange(file); // Gửi đối tượng File lên component cha
        } else {
            setSelectedFileName('');
            onFileChange(null);
        }
    };
    
    // Các định dạng file được hỗ trợ
    const acceptedFormats = ".jpg, .jpeg, .png, .pdf, .docx, .doc"; 
    const isReadyToUpload = selectedFileName && !loading;

    // Inline SVG Icon for File
    const FileIcon = ({ color = '#94a3b8' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="file-icon">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
    );

    return (
        <div className="file-upload-container">
            <input
                type="file"
                ref={fileInputRef}
                accept={acceptedFormats}
                onChange={handleFileSelect}
                className="file-input-hidden"
            />

            <div className="upload-interface-grid">
                
                {/* Khu vực 1: Trạng thái tệp (Thông tin và biểu tượng) */}
                <div className="file-status-panel" onClick={() => fileInputRef.current.click()}>
                    <FileIcon color={selectedFileName ? '#38bdf8' : '#94a3b8'} />
                    <div className="file-info">
                        <span className={`file-name-display ${selectedFileName ? 'selected' : 'placeholder'}`}>
                            {selectedFileName || 'Chọn tệp để bắt đầu quá trình phân tích...'}
                        </span>
                        <span className="file-format-hint">
                            Định dạng hỗ trợ: {acceptedFormats}
                        </span>
                    </div>
                </div>

                {/* Khu vực 2: Hành động (Xử lý OCR) */}
                <div className="action-panel">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className={`action-button secondary-action ${loading ? 'disabled' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Đang Tải...' : 'Chọn Tệp Mới'}
                    </button>
                    
                    <button
                        onClick={onUpload}
                        className={`action-button primary-action ${isReadyToUpload ? 'active' : 'disabled'}`}
                        disabled={!isReadyToUpload}
                    >
                        {loading ? 'Đang Xử Lý Schema...' : 'Xác Nhận & Xử Lý OCR'}
                    </button>
                </div>
            </div>
            
            {/* Hiển thị lỗi */}
            {error && (
                <p className="upload-error-message">
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
