import React, { useEffect, useState } from "react";
import { Button, Box, Typography, IconButton, Card, CardMedia } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "../../stores/store";

const FilePickerWithPreview = ({ position }: { position: number }) => {
    const { productPhotos, setField } = useStore();
    const [file, setFile] = useState(null); // Stores the file object
    const [preview, setPreview] = useState(''); // Stores the file preview URL

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; // Get the first selected file
        if (selectedFile) {
            console.log('FILE SIZE', selectedFile.size)
            if (selectedFile.size > 3 * 1024 * 1024) { // 2MB limit
                alert("File size should not exceed 3MB");
                return;
            }
            setFile(selectedFile);
            productPhotos[position] = selectedFile;
            console.log('SELECTED FILE', productPhotos)
            setField('productPhotos', productPhotos);
            setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview('');
        URL.revokeObjectURL(preview); // Free up memory
    };

    useEffect(() => {
        if (productPhotos[position]) {
            setPreview(productPhotos[position]['photo_url'])
        }
    }, [productPhotos])
    return (
        <Box sx={{ pb: 3 }}>
            <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ marginBottom: 2 }}
            >
                Select File
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>

            {preview && (
                <Card sx={{ maxWidth: 200, marginTop: 2, position: "relative" }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={preview}
                        alt={file?.name}
                        sx={{ border: "1px solid #ccc" }}
                    />
                    {file && <Box sx={{ padding: 2 }}>
                        <Typography variant="body1" noWrap>
                            {file?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {(file?.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                    </Box>}
                    <IconButton
                        color="error"
                        onClick={clearFile}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Card>
            )}
        </Box>
    );
};

export default FilePickerWithPreview;
