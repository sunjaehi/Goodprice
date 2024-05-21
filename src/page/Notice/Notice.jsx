import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import { Container, List, ListItemButton, ListItemText } from "@mui/material";
import { useSearchParams } from "react-router-dom";

function Notice() {
    const [notices, setNotices] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 0;
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/notice/?page=${page}`)
            .then(response => response.json())
            .then(json => setNotices(json));

    }, [])
    return (
        <Container maxWidth="sm">
            <List>
                {notices && notices.map(notice => (
                    <ListItemButton>
                        <ListItemText
                            primary={notice.title}
                            secondary={`조회수 : ${notice.viewCount} - ${notice.author} ${notice.createdAt}`} />
                    </ListItemButton>
                ))}
            </List>
            <Pagination count={10} />
        </Container>
    );
}
export default Notice;