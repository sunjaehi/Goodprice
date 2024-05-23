import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import { Container, List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Notice() {
    const navigate = useNavigate();
    const [notices, setNotices] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/notice/?page=${page - 1}`)
            .then(response => response.json())
            .then(json => setNotices(json));

    }, [searchParams])

    function handleChange(event, page) {
        navigate(`/Notice?page=${page}`)
    }
    return (
        <Container maxWidth="sm">
            <List>
                {notices && notices.map(notice => (
                    <ListItemButton component={Link} to={`/NoticeDetail?id=${notice.id}`} key={notice.id}>
                        <ListItemText
                            primary={`${notice.title}`}
                            secondary={`${notice.createdAt} | 조회수 : ${notice.viewCount}`} />
                    </ListItemButton>
                ))}
            </List>
            <Pagination count={10} onChange={handleChange} />
        </Container>
    );
}
export default Notice;