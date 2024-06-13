import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import { Container, List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SecurityUpdateGood } from "@mui/icons-material";

const backend = process.env.REACT_APP_BACKEND_ADDR;

function Notice() {
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [notices, setNotices] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);
    useEffect(() => {
        fetch(`${backend}/api/v1/notice?page=${page - 1}`)
            .then(response => response.json())
            .then(json => {
                setResponse(json);
                if (json && json.notices) {
                    setNotices(json.notices);
                } else {
                    setNotices([]);
                }
            });

    }, [searchParams])

    function handleChange(event, page) {
        setPage(page);
        navigate(`/Notice?page=${page}`)
    }
    return (
        <>
            {response &&
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
                    <Pagination
                        count={response.totalPages}
                        page={page}
                        onChange={handleChange}
                        siblingCount={1}
                        size="large"
                    />
                </Container>
            }
        </>
    );

}
export default Notice;