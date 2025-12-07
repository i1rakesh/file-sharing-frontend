import React from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const FileList = ({ files, onShare, onFileDeleted }) => {
    const { user } = useAuth();

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownload = async (file) => {
        try {

            const response = await apiClient.get(`/files/${file._id}/download`, {
                responseType: 'blob', 
            });
            
            
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.filename); 
            document.body.appendChild(link);
            link.click();
            
            
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed.');
        }
    };

    return (
        <div className="file-list">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e9ecef' }}>
                        <th style={cellStyle}>Filename</th>
                        <th style={cellStyle}>Type</th>
                        <th style={cellStyle}>Size</th>
                        <th style={cellStyle}>Owner</th>
                        <th style={cellStyle}>Upload Date</th>
                        <th style={cellStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => {
                        const isOwner = file.ownerId === user._id;
                        return (
                            <tr key={file._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={cellStyle}>{file.filename}</td>
                                <td style={cellStyle}>{file.fileType.split('/')[1].toUpperCase() || 'FILE'}</td>
                                <td style={cellStyle}>{formatFileSize(file.fileSize)}</td>
                                <td style={{ ...cellStyle, fontWeight: isOwner ? 'bold' : 'normal' }}>
                                    {isOwner ? 'You' : 'Shared'}
                                </td>
                                <td style={cellStyle}>{new Date(file.createdAt).toLocaleDateString()}</td>
                                <td style={cellStyle}>
                                    <button onClick={() => handleDownload(file)} style={actionButtonStyle}>Download</button>
                                    {/* Only owner can share */}
                                    {isOwner && (
                                        <button 
                                            onClick={() => onShare(file)} 
                                            style={{ ...actionButtonStyle, backgroundColor: '#28a745' }}
                                        >
                                            Share
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const cellStyle = {
    padding: '10px',
    textAlign: 'left',
};

const actionButtonStyle = {
    padding: '5px 10px',
    fontSize: '12px',
    margin: '3px',
};

export default FileList;