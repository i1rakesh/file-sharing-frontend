
import React, { useState } from 'react';
import apiClient from '../api/axios';

const FileUploader = ({ onUploadSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            setUploadMessage('Please select files to upload.');
            return;
        }

        setUploading(true);
        setUploadMessage('Uploading...');
        
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file); 
            });

            const res = await apiClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadMessage(`${res.data.message} (${res.data.files.length} files)`);
            setSelectedFiles([]);
            onUploadSuccess(); 
            
        } catch (error) {
            console.error('Upload Error:', error);
            setUploadMessage('Upload failed: ' + (error.response?.data?.message || 'Server error.'));
        } finally {
            setUploading(false);
            setTimeout(() => setUploadMessage(''), 5000); 
        }
    };

    return (
        <div style={{ marginBottom: '30px', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <h3>File Uploader (Max 10 files, 50MB each)</h3>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <button type="submit" disabled={uploading || selectedFiles.length === 0}>
                    {uploading ? 'Processing...' : `Upload ${selectedFiles.length} File(s)`}
                </button>
            </form>
            {uploadMessage && <p style={{ color: uploading ? '#007bff' : 'red' }}>{uploadMessage}</p>}
        </div>
    );
};

export default FileUploader;