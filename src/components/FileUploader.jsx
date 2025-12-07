// src/components/Uploader.jsx
import React, { useState, useRef } from 'react';
import apiClient from '../api/axios';

// Define the constraints
const MAX_FILE_COUNT = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIMETYPES = [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv', 
    'application/vnd.ms-excel'
];

const Uploader = ({ onUploadSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelection = (newFiles) => {
        setMessage('');
        let filesToAdd = Array.from(newFiles);
        let currentTotal = selectedFiles.length;

        if (currentTotal + filesToAdd.length > MAX_FILE_COUNT) {
            setMessage(`Error: Cannot upload more than ${MAX_FILE_COUNT} files. Skipping ${filesToAdd.length + currentTotal - MAX_FILE_COUNT} file(s).`);
            filesToAdd = filesToAdd.slice(0, MAX_FILE_COUNT - currentTotal);
        }

        const validFiles = filesToAdd.filter(file => {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setMessage(`Error: File ${file.name} exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
                return false;
            }
            if (!ALLOWED_MIMETYPES.includes(file.type)) {
                 setMessage(`Error: File ${file.name} is not a permitted type (Photos/PDF/Word/Excel only).`);
                 return false;
            }
            return true;
        });

        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files) {
            handleFileSelection(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setMessage(''); // Clear message when files are changed
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessage('Please select files before uploading.');
            return;
        }

        setLoading(true);
        setMessage('Uploading files...');

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file); // 'files' must match the key used in your multer setup
        });

        try {
            const res = await apiClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(res.data.message);
            setSelectedFiles([]); // Clear selection on success
            onUploadSuccess(); // Trigger dashboard refresh
        } catch (error) {
            setMessage('Upload failed: ' + (error.response?.data?.message || 'Server error.'));
        } finally {
            setLoading(false);
        }
    };
    
    // --- STYLING ---
    const dropzoneStyle = {
        padding: '20px',
        border: `2px dashed ${isDragActive ? '#3fd465' : '#ccc'}`,
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '20px',
        backgroundColor: isDragActive ? '#e6f7ff' : '#f8f8f8',
        transition: 'background-color 0.2s',
    };

    const chipContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        minHeight: selectedFiles.length > 0 ? 'auto' : '0px',
    };

    const chipStyle = {
        padding: '8px 12px',
        backgroundColor: '#3fd465',
        color: 'white',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
    };

    const removeButtonStyle = {
        marginLeft: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        padding: '0 4px',
        lineHeight: '1',
    };

    return (
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>Upload Files (Max 5 files, Max 5MB each)</h3>
            
            {/* Drag and Drop Zone */}
            <div 
                style={dropzoneStyle}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelection(e.target.files)}
                    style={{ display: 'none' }}
                />
                <p style={{ margin: '0' }}>
                    **{isDragActive ? 'Drop files here!' : 'Drag & drop files here, or click to select.'}**
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                    Allowed: Photos (JPG/PNG), PDF, Word, Excel.
                </p>
            </div>
            
            {/* File Chips Display */}
            <div style={chipContainerStyle}>
                {selectedFiles.map((file, index) => (
                    <div key={index} style={chipStyle}>
                        <span>{file.name} ({formatFileSize(file.size)})</span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(index);
                            }} 
                            style={removeButtonStyle}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleUpload} 
                disabled={loading || selectedFiles.length === 0}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: selectedFiles.length > 0 ? '#28a745' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedFiles.length > 0 ? 'pointer' : 'not-allowed',
                }}
            >
                {loading ? 'Uploading...' : `Upload (${selectedFiles.length} files)`}
            </button>

            {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
};

export default Uploader;