import React, { useEffect, useState, useRef } from 'react';
import { Container, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const backend = process.env.REACT_APP_BACKEND_ADDR;

const ShopNewsInput = () => {
    const navigate = useNavigate();
    const [shop, setShop] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const atk = sessionStorage.getItem('atk');
    const [permittedShops, setPermittedShops] = useState([]);
    const imageInput = useRef(null);

    useEffect(() => {
        fetch(`${backend}/api/v1/shop-manager/check-permissions`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + atk
            }
        })
            .then(response => response.json())
            .then(json => setPermittedShops(json));
    }, [atk]);

    const handleShopChange = (event) => {
        setShop(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleImageChange = (event) => {
        let newFiles = Array.from(event.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('shopId', shop);
        formData.append('title', title);
        formData.append('content', content);
        selectedFiles.forEach(file => formData.append('files', file));

        try {
            const response = await fetch(`${backend}/api/v1/shop-news/`, {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + atk
                },
                body: formData
            });

            if (response.ok) {
                alert('가게 소식이 성공적으로 등록되었습니다.');
                navigate('/newsfeed');
            } else {
                alert('가게 소식 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        }
    };

    const isSubmitDisabled = !shop || !title || !content;

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                가게 소식 작성
            </Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="shop-select-label">가게 선택</InputLabel>
                    <Select
                        labelId="shop-select-label"
                        value={shop}
                        onChange={handleShopChange}
                        label="가게 선택"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {permittedShops.map(shop => (
                            <MenuItem key={shop.shopId} value={shop.shopId}>{shop.shopName}({shop.shopAddress})</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="제목"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={handleTitleChange}
                    variant="outlined"
                />
                <TextField
                    label="내용"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={content}
                    onChange={handleContentChange}
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCamera />}
                    fullWidth
                    sx={{ marginTop: 2, marginBottom: 2 }}
                >
                    사진 첨부
                    <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        ref={imageInput}
                        onChange={handleImageChange}
                    />
                </Button>
                <div className="preview" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                    {previews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative', margin: '10px' }}>
                            <img
                                alt="미리보기 제공 불가"
                                src={preview}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => removeImage(index)}
                                style={{ position: 'absolute', top: '5px', right: '5px', minWidth: '30px', minHeight: '30px', padding: '5px' }}
                            >
                                X
                            </Button>
                        </div>
                    ))}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={isSubmitDisabled}
                >
                    제출
                </Button>
            </Box>
        </Container>
    );
};

export default ShopNewsInput;