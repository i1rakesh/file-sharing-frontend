
import React, { useState } from 'react';
import apiClient from '../api/axios';

const SharingModal = ({ file, onClose }) => {
    const [targetEmails, setTargetEmails] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShareWithUsers = async () => {
        const emailsArray = targetEmails.split(',').map(email => email.trim()).filter(Boolean);
        if (emailsArray.length === 0) {
            setMessage('Please enter at least one email address.');
            return;
        }

        setLoading(true);
        setMessage('Sharing with users...');

        try {
            const res = await apiClient.post(`/files/${file._id}/share/user`, {
                targetEmails: emailsArray,
            });
            
            setMessage(res.data.message);
            setTargetEmails(''); 
        } catch (error) {
            setMessage('Sharing failed: ' + (error.response?.data?.message || 'Server error.'));
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLink = async () => {
        setLoading(true);
        setMessage('Generating link...');
        setShareLink('');

        try {
            const res = await apiClient.post(`/files/${file._id}/share/link`);
            
            const fullLink = `${window.location.origin}${res.data.shareLink}`;

            setShareLink(fullLink);
            setMessage('Share link generated successfully!');
        } catch (error) {
            setMessage('Link generation failed: ' + (error.response?.data?.message || 'Server error.'));
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setMessage('Link copied to clipboard!');
    };

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const contentStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    };

    const inputGroupStyle = {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    Share File: {file.filename}
                </h3>
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', color: '#333', border: 'none' }}
                >
                    &times;
                </button>

                {/* Sharing with Specific Users */}
                <div style={inputGroupStyle}>
                    <h4>1. Share with Specific Users</h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>Enter emails, separated by commas.</p>
                    <textarea
                        value={targetEmails}
                        onChange={(e) => setTargetEmails(e.target.value)}
                        placeholder="user1@example.com, user2@example.com"
                        rows="3"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }}
                        disabled={loading}
                    />
                    <button onClick={handleShareWithUsers} disabled={loading}>
                        Share Now
                    </button>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dotted #ccc' }} />

                {/* Sharing via Link */}
                <div style={inputGroupStyle}>
                    <h4>2. Share via Link (Requires User Login)</h4>
                    <button onClick={handleGenerateLink} disabled={loading}>
                        {shareLink ? 'Regenerate Link' : 'Generate Link'}
                    </button>

                    {shareLink && (
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #eee', display: 'flex' }}>
                            <input
                                type="text"
                                value={shareLink}
                                readOnly
                                style={{ flexGrow: 1, marginRight: '10px', padding: '5px', fontSize: '14px' }}
                            />
                            <button onClick={handleCopyLink} style={{ backgroundColor: '#17a2b8' }}>
                                Copy
                            </button>
                        </div>
                    )}
                </div>

                {message && <p style={{ marginTop: '15px', color: loading ? '#007bff' : (message.includes('failed') ? 'red' : 'green') }}>{message}</p>}
            </div>
        </div>
    );
};

export default SharingModal;