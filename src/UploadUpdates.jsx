import React, { useState, useRef } from 'react';
import { FaUpload, FaImage, FaVideo, FaMicrophone, FaSpinner, FaCheckCircle, FaTimesCircle, FaCamera, FaTimes } from 'react-icons/fa';
import { uploadFile, saveUpdate } from './utils';

function UploadUpdates() {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      if (selectedFile.type.startsWith('image/')) {
        setMediaType('image');
      } else if (selectedFile.type.startsWith('video/')) {
        setMediaType('video');
      } else if (selectedFile.type.startsWith('audio/')) {
        setMediaType('voice');
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, // Default to front camera
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setCameraStream(stream);
      setShowCamera(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Cannot access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const capturedFile = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFile(capturedFile);
        setMediaType('image');
        stopCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const switchCamera = async () => {
    if (cameraStream) {
      const videoTrack = cameraStream.getVideoTracks()[0];
      const currentFacingMode = videoTrack.getSettings().facingMode;
      
      stopCamera();
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: currentFacingMode === 'user' ? 'environment' : 'user' },
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        
        setCameraStream(stream);
      } catch (error) {
        console.error('Switch camera error:', error);
        startCamera(); // Fallback to default camera
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus(null);
    
    try {
      const mediaUrl = await uploadFile(file);
      
      await saveUpdate({
        mediaUrl,
        mediaType,
        caption
      });
      
      setUploadStatus('success');
      
      setTimeout(() => {
        setCaption('');
        setFile(null);
        setMediaType('');
        setUploadStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2 className="upload-title">📤 Upload Updates for Bee</h2>
        <p className="upload-subtitle">Send pictures, videos, or voice messages 💕</p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label className="form-label">Caption / Message</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something sweet for Bee..."
              className="form-textarea"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Media</label>
            
            {/* Camera Modal */}
            {showCamera && (
              <div className="camera-modal">
                <div className="camera-container">
                  <button type="button" onClick={stopCamera} className="close-camera-btn">
                    <FaTimes />
                  </button>
                  
                  <video ref={videoRef} className="camera-preview" playsInline />
                  
                  <div className="camera-controls">
                    <button type="button" onClick={switchCamera} className="switch-camera-btn">
                      🔄 Flip
                    </button>
                    <button type="button" onClick={capturePhoto} className="capture-btn">
                      <FaCamera /> Capture
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="upload-options">
              <button type="button" onClick={startCamera} className="camera-btn">
                <FaCamera /> Open Camera
              </button>
              
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileChange}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-label">
                  <FaUpload />
                  <span>{file ? file.name : 'Choose from gallery'}</span>
                </label>
              </div>
            </div>

            {file && (
              <div className="file-preview">
                {mediaType === 'image' && (
                  <div className="preview-box">
                    <FaImage className="preview-icon" />
                    <p>Image ready to send</p>
                  </div>
                )}
                {mediaType === 'video' && (
                  <div className="preview-box">
                    <FaVideo className="preview-icon" />
                    <p>Video ready to send</p>
                  </div>
                )}
                {mediaType === 'voice' && (
                  <div className="preview-box">
                    <FaMicrophone className="preview-icon" />
                    <p>Voice message ready</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={!file || !caption || uploading}>
            {uploading ? (
              <>
                <FaSpinner className="spinner" /> Uploading...
              </>
            ) : uploadStatus === 'success' ? (
              <>
                <FaCheckCircle /> Sent Successfully!
              </>
            ) : uploadStatus === 'error' ? (
              <>
                <FaTimesCircle /> Upload Failed
              </>
            ) : (
              'Send to Bee 💖'
            )}
          </button>
        </form>

        {uploadStatus === 'success' && (
          <div className="upload-success">
            ✅ Your update has been sent to Bee! 💕
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="upload-error">
            ❌ Something went wrong. Please try again.
          </div>
        )}

        <div className="upload-note">
          <p>🔒 This will be saved securely and Bee will see it in her corner!</p>
        </div>
      </div>

      <style jsx>{`
        .camera-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          padding: 20px;
        }

        .close-camera-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          z-index: 10;
        }

        .camera-preview {
          width: 100%;
          border-radius: 10px;
          background: black;
        }

        .camera-controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }

        .capture-btn {
          background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
        }

        .switch-camera-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 10px 20px;
          border-radius: 50px;
          cursor: pointer;
        }

        .upload-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .camera-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .camera-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
}

export default UploadUpdates;