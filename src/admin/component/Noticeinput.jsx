import React, { useRef, useState } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Divider, TextField, Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';

export default function Noticeinput() {
    const navigate = useNavigate();
    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
    }
    const imageInput = useRef(null);
    const titleInput = useRef(null);
    const contentInput = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const formData = new FormData();
    const [formItem, setFormItem] = useState({
        title:'',
        content:''
    });
    const handleInput = (e) => {
        const {id, value} = e.target;
        setFormItem((prevData) => ({
            ...prevData,
            [id] : value,
        }));
    }
    const isFormValid = () => {
        return formItem.title && formItem.content;
    }

    const noticeSubmit = (e) => {
        e.preventDefault();

        formData.append('title', titleInput.current.value);
        formData.append('content', contentInput.current.value);
        selectedFiles.forEach(file => formData.append('files', file));

        fetch(`http://localhost:8080/api/v1/notice/new`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("atk")
            },
            body: formData,
        })
            .then((response) => {
                if (response.status === 201) {
                    alert('공지사항이 등록되었습니다.');
                } else {
                    alert('공지사항 등록에 실패했습니다.');
                }
                navigate(-1);
            });
    };
    const onChangeFile = (e) => {
        let files = Array.from(e.target.files);
        setSelectedFiles(files);
        const previews = files.map(file => {
            return URL.createObjectURL(file);
        });
        setPreviews(previews);
    }
    return (
        <form>
            <Box
                component="form"
                autoComplete="off"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Adminlist />
                <Divider orientation="vertical" variant="fullWidth" />
                <Box component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "10px",
                        mt: "10px",
                        width: "50%",
                        ml: "20px",
                    }}
                >
                    <TextField id="title" label="제목" value={formItem.title} onChange={handleInput} inputRef={titleInput} variant="outlined" fullWidth sx={{ mb: "20px" }} />
                    <TextField id="content" label="내용을 입력해주세요" value={formItem.content} onChange={handleInput} inputRef={contentInput} variant="outlined" fullWidth multiline rows={15} />
                    <Stack spacing={3} direction="row-reverse" sx={{ mt: "5px" }}>
                        <Button variant="contained" sx={{
                            color: "white", backgroundColor: "black", borderRadius: "20px",
                            ":hover": { backgroundColor: "grey" }
                        }}
                            onClick={noticeSubmit}
                            disabled={!isFormValid()}
                        >등록</Button>
                        <Button variant="contained" sx={{
                            color: "white", backgroundColor: "grey", borderRadius: "20px",
                            ":hover": { backgroundColor: "lightgrey" }
                        }} onClick={navigateToMainadmin}>취소</Button>
                    </Stack>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="중요 (이 항목을 체크하면 사용자에게 PUSH알림이 전송됩니다)" />
                    </FormGroup>

                </Box>
                {/* <label htmlFor="file">
                
            </label> */}
                <>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={imageInput}
                        id="file"
                        onChange={onChangeFile}
                        style={{ display: "none" }}
                    />
                    <Button startIcon={<AddIcon />} variant="contained"
                        sx={{
                            color: "black", backgroundColor: "lightgrey", borderRadius: "10px", mt: "10px", ml: "5px", height: "50px",
                            ":hover": {
                                backgroundColor: "grey"
                            }
                        }}
                        onClick={() => imageInput.current.click()}
                    >사진 추가</Button>
                </>

                <div className="preview">
                    {previews.map((preview, index) => (
                        <img
                            key={index}
                            alt="미리보기 제공 불가"
                            src={preview}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: "10px" }}
                        />
                    ))}
                </div>

            </Box>
        </form>

    );
}