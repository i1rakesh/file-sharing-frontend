
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import SharingModal from '../components/SharingModal';

const Dashboard = ({ isSharing}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { token } = useParams(); 

    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchFiles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/files/my-files');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
            
        } finally {
            setIsLoading(false);
        }
    }, []);

    
    useEffect(() => {
        if (user && !isSharing) {
            fetchFiles();
        }
    }, [user, isSharing, fetchFiles]);
    

useEffect(() => {

    if (isSharing && token) {

        if (!user) {
            alert("Authentication is required to access shared files. Please log in.");
            sessionStorage.setItem('pending_share_link', location.pathname); 
            navigate('/login');
            return;
        }
        
        const userToken = localStorage.getItem('token');
        const encodedToken = encodeURIComponent(userToken);
        

        const accessUrl = `http://localhost:5000/api/files/access/${token}?access_token=${encodedToken}`;
        
        const redirectTimer = setTimeout(() => {
             window.location.href = accessUrl;
        }, 100); 

        return () => clearTimeout(redirectTimer); 

    }
}, [isSharing, token, user, navigate, location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleShare = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const handleFileDeleted = (fileId) => {

        setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
    };


    if (!user) return <div>Authenticating...</div>; 


    if (isSharing) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Accessing Shared File...</h2>
                <p>Please wait while we verify your access rights and initiate the download.</p>
                <p>If the download doesn't start, your account may not be authorized for this link.</p>
            </div>
        );
    }
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Welcome, {user.name}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            
            <FileUploader onUploadSuccess={fetchFiles} />
            
            <hr />
            
            <h2>Your Files</h2>
            {isLoading ? (
                <p>Loading files...</p>
            ) : files.length === 0 ? (
                <p>You have no files yet. Upload one to get started!</p>
            ) : (
                <FileList 
                    files={files} 
                    onShare={handleShare} 
                    onFileDeleted={handleFileDeleted}
                />
            )}

            {isModalOpen && selectedFile && (
                <SharingModal 
                    file={selectedFile}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;