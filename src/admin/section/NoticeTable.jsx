import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Stack, Typography, Button } from '@mui/material';
import Adminlist from './Adminlist';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from "react-router-dom";

export default function NoticeTable() {
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [notices, setNotices] = useState(null);
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/notice/')
            .then(result => result.json())
            .then(json => {
                setResponse(json);
                if (json && json.notices) {
                    setNotices(json.notices);
                } else {
                    setNotices([]);
                }
            })
    }, [])
    const navigateToRegistershop = () => {
        navigate("/Registershop");
    }
    const navigateToProposalmanage = () => {
        navigate("/Proposalmanage");
    }

    const handleRowClick = (shopId) => {
        navigate(`/shopManage/${shopId}`);
    };
    const handleChangePage = (event, newPage) => {
        fetch(`http://localhost:8080/api/v1/shop/list?page=${newPage}`)
            .then(result => result.json())
            .then(json => {
                setResponse(json);
                if (json && json.shops) {
                    setNotices(json.shops);
                } else {
                    setNotices([]);
                }
            })
    };
    return (

        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "85%"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mr={3}>
                <Typography variant="h4">공지사항 관리</Typography>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="contained" color="inherit" onClick={() => navigate('/NoticeInput')}>
                        공지사항 등록
                    </Button>
                </Stack>
            </Stack>
            {response &&
                <TableContainer component={Paper}>
                    <Table width="85%" sx={{ minWidth: 650, mr: "10px" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>공지사항 ID</TableCell>
                                <TableCell align="right">제목</TableCell>
                                <TableCell align="right">조회수</TableCell>
                                <TableCell align="right">업로드 일자</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notices && notices.map((notice) => (
                                <TableRow key={notice.id} onClick={() => handleRowClick(notice.id)} style={{ cursor: 'pointer' }}>
                                    <TableCell component="th" scope="row">
                                        {notice.id}
                                    </TableCell>
                                    <TableCell align="right">{notice.title}</TableCell>
                                    <TableCell align="right">{notice.viewCount}</TableCell>
                                    <TableCell align="right">{notice.createdAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={response.totalElements}
                        page={response.currentPage}
                        rowsPerPage={10}
                        onPageChange={handleChangePage}
                        ActionsComponent={({ onPageChange, count, page }) => (
                            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                                <Button
                                    onClick={() => onPageChange(null, 0)}
                                    disabled={page === 0}
                                    aria-label="첫 페이지로"
                                >
                                    첫 페이지
                                </Button>
                                <Button
                                    onClick={() => onPageChange(null, page - 1)}
                                    disabled={page === 0}
                                    aria-label="이전 페이지로"
                                >
                                    이전
                                </Button>
                                <Button
                                    onClick={() => onPageChange(null, page + 1)}
                                    disabled={page >= Math.ceil(count / 10) - 1}
                                    aria-label="다음 페이지로"
                                >
                                    다음
                                </Button>
                                <Button
                                    onClick={() => onPageChange(null, Math.max(0, Math.ceil(count / 10) - 1))}
                                    disabled={page >= Math.ceil(count / 10) - 1}
                                    aria-label="마지막 페이지로"
                                >
                                    마지막 페이지
                                </Button>
                            </Box>
                        )}
                    />
                </TableContainer>
            }
        </Box>

    )
}