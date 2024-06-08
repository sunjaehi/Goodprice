import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useRef, useState } from "react";
const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function ProductEditDialog({ product, editFormOpen, setEditFormOpen }) {
    const [imageDeleted, setImageDeleted] = useState(false);
    const newPriceRef = useRef();
    const fileInputRef = useRef();

    const handleImageDelete = () => {
        setImageDeleted(true);
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('id', product.id);
        formData.append('attachmentUrl', product.attachmentId);
        formData.append('price', newPriceRef.current.value);
        formData.append('isDeleteImage', imageDeleted);

        if (fileInputRef.current && fileInputRef.current.files.length > 0) {
            formData.append('file', fileInputRef.current.files[0]);
        }

        fetch(`${backend}/api/v1/product/edit`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('atk')}`
            },
            body: formData
        }).then(response => {
            if (response.status === 200) {
                alert('수정 완료!');
                setEditFormOpen(false);
            } else {
                alert('수정 실패ㅜ');
            }
        })
    };

    return (
        <Dialog open={editFormOpen}>
            <DialogTitle>상품 수정</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={3}>
                    <TextField defaultValue={product.name} fullWidth variant="outlined" margin="normal" disabled />
                    <TextField label="가격" fullWidth variant="outlined" margin="normal" defaultValue={product.price} inputRef={newPriceRef} />
                    {product.imgUrl && !imageDeleted ? (
                        <>
                            <img src={product.imgUrl} alt="상품 이미지" />
                            <Button onClick={handleImageDelete}>이미지 삭제</Button>
                        </>
                    ) : (
                        <>
                            <input type="file" accept="image/*" ref={fileInputRef} />
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEdit}>수정</Button>
                <Button onClick={() => setEditFormOpen(false)}>취소</Button>
            </DialogActions>
        </Dialog>
    );
}