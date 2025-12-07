// src/components/FileList.jsx (UPDATED)

import React from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

// --- STYLES FOR MINIMAL UI ---
const baseCellStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const headerStyle = {
    ...baseCellStyle,
    backgroundColor: '#f1f1f1',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #ddd',
};

const rowStyle = {
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #eee',
};

const actionButtonStyle = {
    padding: '6px 12px',
    fontSize: '12px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
};

// Custom style function for row hover effect
const getRowHoverStyle = (isHovering) => ({
    ...rowStyle,
    backgroundColor: isHovering ? '#f9f9f9' : 'white',
});
// ------------------------------


const FileList = ({ files, onShare, onFileDeleted, onAuditLog }) => {
    const { user } = useAuth();
    const [hoveredRow, setHoveredRow] = React.useState(null);

    // Helper function to truncate filename
    const truncateFilename = (filename, limit = 15) => {
        if (filename.length <= limit) {
            return filename;
        }
        // Simple truncation
        return `${filename.substring(0, limit)}...`;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownload = async (file) => {
        try {
            // Note: The download logic is fine, using a blob is a good way to handle the stream response.
            const response = await apiClient.get(`/files/${file._id}/download`, {
                responseType: 'blob', 
            });
            
            const fileType = response.headers['content-type'] || 'application/octet-stream';
            const url = window.URL.createObjectURL(new Blob([response.data], { type: fileType }));
            
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
        <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Filename</th>
                        <th style={headerStyle}>Type</th>
                        <th style={headerStyle}>Size</th>
                        <th style={headerStyle}>Owner</th>
                        <th style={headerStyle}>Upload Date</th>
                        <th style={headerStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => {
                        const isOwner = file.ownerId === user._id;
                        return (
                            <tr 
                                key={file._id} 
                                style={getRowHoverStyle(hoveredRow === file._id)}
                                onMouseEnter={() => setHoveredRow(file._id)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                               
                                <td 
                                    style={{ ...baseCellStyle, maxWidth: '200px', cursor: 'help' }}
                                    title={file.filename} // Full name on hover
                                >
                                    {truncateFilename(file.filename, 25)} 
                                </td>
                                
                                <td style={baseCellStyle} title={file.fileType.split('/')[1]?.toUpperCase()} >{truncateFilename(file.fileType.split('/')[1]?.toUpperCase(), 15) || 'FILE'}</td>
                                <td style={baseCellStyle}>{formatFileSize(file.fileSize)}</td>
                                
                                <td style={{ ...baseCellStyle, fontWeight: isOwner ? '600' : '400', color: isOwner ? '#3fd465' : '#333' }}>
                                    {isOwner ? 'You (Owner)' : 'Shared'}
                                </td>
                                
                                <td style={baseCellStyle}>{new Date(file.createdAt).toLocaleDateString()}</td>
                                
                                <td style={baseCellStyle}>
                                    <button 
                                        onClick={() => handleDownload(file)} 
                                        style={{ ...actionButtonStyle, backgroundColor: '#3fd465' }}
                                    >
                                        Download
                                    </button>
                                    
                                    {isOwner && (
                                        <>
                                            <button 
                                                onClick={() => onShare(file)} 
                                                style={{ ...actionButtonStyle, backgroundColor: '#28a745' }}
                                            >
                                                Share
                                            </button>
                                            
                                        </>
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

export default FileList;