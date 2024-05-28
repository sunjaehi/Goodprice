import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useRef, useState } from "react";

function ProductDialog({ open, handleClose, shopId }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const priceRef = useRef();
    const nameRef = useRef();

    const onChangeFile = (e) => {
        let files = Array.from(e.target.files);
        setSelectedFiles(files);
    }

    const registerProduct = async (e) => {
        const formData = new FormData();
        formData.append('shopId', shopId);
        formData.append('name', nameRef.current.value);
        formData.append('price', priceRef.current.value);
        selectedFiles.forEach(file => formData.append('files', file));

        const result = await fetch('http://localhost:8080/api/v1/product/new',
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('atk')}`
                },
                body: formData,
            }
        )
        if (result.status === 201) {
            alert('등록 성공!');
            handleClose();
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle> 상품 추가</DialogTitle >
            <DialogContent>
                <Stack direction="column" spacing={3}>
                    <TextField label="상품명" fullWidth variant="outlined" margin="normal" inputRef={nameRef} />
                    <TextField label="가격" fullWidth variant="outlined" margin="normal" inputRef={priceRef} />
                    <input type="file" accept="image/*" multiple onChange={onChangeFile} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={registerProduct}>추가</Button>
                <Button onClick={handleClose}>취소</Button>
            </DialogActions>
        </Dialog >
    );
}

export default ProductDialog;