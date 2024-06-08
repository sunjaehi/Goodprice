import React, { useEffect, useState } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Button, Stack } from "@mui/material";
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
    }, [])

    const deleteNotice = () => {
        console.log('test');
        fetch(`${backend}/api/v1/notice/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            }
        }).then(response => {
            if (response.status == 200) {
                alert("삭제 성공")
            } else {
                alert("삭제 실패")
            }
        })
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row"
        }}>
            <Adminlist />
            <div>
                <h1>제목 : {notice && notice.title}</h1>
                <hr />
                <h2>내용 : {notice && notice.content}</h2>
                {
                    notice && notice.imgUrls.map(imgUrl => (
                        <img src={imgUrl} style={{ width: '100%', height: 'auto' }} />
                    ))
                }
                <Button variant="contained" onClick={() => navigate(`/noticeAdminEdit/${id}`)}>수정</Button>
                <Button variant="contained" onClick={deleteNotice}>삭제</Button>
            </div>
        </Box >
    );
}