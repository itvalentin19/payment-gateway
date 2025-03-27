import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const QrCode = ({ updateQRcode }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      console.log(file);
      
      updateQRcode(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        QR Code Image Upload
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          mb: 3,
          maxWidth: 500,
          mx: 'auto'
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
        <Typography variant="body1">
          {isDragActive ?
            'Drop image here' :
            'Drag & drop image, or click to select'}
        </Typography>
      </Box>

      {selectedImage && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Preview:</Typography>
          <img
            src={selectedImage}
            alt="Upload preview"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default QrCode;
