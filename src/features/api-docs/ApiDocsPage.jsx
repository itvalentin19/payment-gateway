import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const ApiDocsPage = () => {
  const [files, setFiles] = useState([]);
  
  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    )]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 5
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        API Documentation Upload
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
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography>
          {isDragActive ? 
            'Drop PDF files here' : 
            'Drag & drop PDF files here, or click to select'}
        </Typography>
      </Box>

      {files.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Uploaded Files:
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {/* Add upload logic here */}}
          >
            Submit Documentation
          </Button>
        </>
      )}
    </Box>
  );
};

export default ApiDocsPage;
