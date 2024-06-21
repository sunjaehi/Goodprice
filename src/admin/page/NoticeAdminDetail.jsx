import React, { useEffect, useState } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function NoticeAdminDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        fetch(`${backend}/api/v1/notice/${id}`)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                setNotice(json);
            })
    }, [id]);

    const deleteNotice = () => {
        console.log('test');
        fetch(`${backend}/api/v1/notice/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            }
        }).then(response => {
            if (response.status === 200) {
                alert("삭제 성공");
                navigate("/noticeAdmin"); // 삭제 후 목록 페이지로 이동
            } else {
                alert("삭제 실패");
            }
        });
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row"
        }}>
            <Adminlist />
            <div>
                <Typography variant="h4" sx={{ marginTop: 2 }}>제목 : {notice && notice.title}</Typography>
                <hr />
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>내용 : {notice && notice.content}</Typography>
                {
                    notice && notice.imgUrls.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt={`notice-img-${index}`}
                            style={{
                                maxWidth: '850px',
                                maxHeight: '850px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                width: '100%',
                                height: 'auto'
                            }}
                        />
                    ))
                }
                <br />
                <Box sx={{ marginTop: 3 }}>
                    <Button variant="contained" sx={{ mr: 2 }} onClick={() => navigate(`/noticeAdminEdit/${id}`)}>수정</Button>
                    <Button variant="outlined" sx={{ color: 'black', borderColor: 'black' }} onClick={deleteNotice}>삭제</Button>
                </Box>
            </div>
        </Box>
    );
}
