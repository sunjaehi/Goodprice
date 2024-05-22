import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import { Container, List, ListItemButton, ListItemText } from "@mui/material";
import { useSearchParams } from "react-router-dom";

function NoticeDetail() {
    const [notice, setNotice] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get('id');
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/notice/${id}`)
            .then(response => response.json())
            .then(json => setNotice(json));

    }, [])
    return (
        <Container maxWidth="sm"    >
            {notice && (<h3>{notice.title}</h3>)}
            {notice && (<p>{notice.author}</p>)}
            {notice && (<p>{notice.createdAt}</p>)}

            <hr />
            {notice && (<p>{notice.content}</p>)}
            {notice && notice.imgUrls.map(imgUrl => (
                <img src={imgUrl} style={{ width: '100%', height: 'auto' }} />
            ))}
        </Container>
    );
}
export default NoticeDetail;