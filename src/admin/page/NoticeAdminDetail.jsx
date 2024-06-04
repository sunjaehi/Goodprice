import React, { useEffect, useRef, useState } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Divider, TextField, Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function NoticeAdminDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id);
    const [notice, setNotice] = useState(null);

    function noticeSubmit() { }
    const onChangeFile = (e) => { };
    const [previews, setPriviews] = useState([]);
    const removeImage = () => { };

    const onFormChange = (e) => {
        setNotice({ ...notice, [e.target.name]: e.target.value });
    }

    function submit() {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', notice.title);
        formData.apeend('content', notice.content);

    }

    useEffect(() => {
        fetch(`${backend}/notice/${id}`)
            .then(response => response.json())
            .then(json => setNotice(json))
    }, [])

    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
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
                {notice && (
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
                        <TextField name="title" label="제목" variant="outlined" fullWidth sx={{ mb: "20px" }} value={notice.title} onChange={onFormChange} />
                        <TextField name="content" label="내용을 입력해주세요" variant="outlined" fullWidth multiline rows={15} value={notice.content} onChange={onFormChange} />
                        <Stack spacing={3} direction="row-reverse" sx={{ mt: "5px" }}>
                            <Button variant="contained" sx={{
                                color: "white", backgroundColor: "black", borderRadius: "20px",
                                ":hover": { backgroundColor: "grey" }
                            }}
                                onClick={noticeSubmit}
                            >등록</Button>
                            <Button variant="contained" sx={{
                                color: "white", backgroundColor: "grey", borderRadius: "20px",
                                ":hover": { backgroundColor: "lightgrey" }
                            }} onClick={navigateToMainadmin}>취소</Button>
                        </Stack>
                    </Box>
                )}
                <>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
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
                    >
                        사진 추가
                    </Button>
                </>

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

            </Box>
        </form>

    );
}