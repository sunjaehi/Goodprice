import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_ADDR;
export default function MemberTable() {
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [members, setMembers] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchMembers(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchMembers = (page, rowsPerPage) => {
        fetch(`${backend}/api/v1/member/list?page=${page}&size=${rowsPerPage}`)
            .then(result => result.json())
            .then(json => {
                setResponse(json);
                if (json && json.memberList) {
                    setMembers(json.memberList);
                } else {
                    setMembers([]);
                }
            });
    };

    const handleRowClick = (id) => {
        navigate(`/member-admin-detail/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchEmail(event.target.value);
    };

    const filteredMembers = members.filter(member => member.email.includes(searchEmail));

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "85%"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mr={3}>
                <Typography variant="h4">회원 관리</Typography>
                <TextField
                    label="이메일 검색"
                    variant="outlined"
                    value={searchEmail}
                    onChange={handleSearchChange}
                    sx={{ width: '300px' }}
                />
            </Stack>
            {response &&
                <TableContainer component={Paper}>
                    <Table width="85%" sx={{ minWidth: 650, mr: "10px" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">이메일</TableCell>
                                <TableCell align="right">닉네임</TableCell>
                                <TableCell align="right">역할</TableCell>
                                <TableCell align="right">가입일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.id} onClick={() => handleRowClick(member.id)} style={{ cursor: 'pointer' }}>
                                    <TableCell component="th" scope="row">
                                        {member.id}
                                    </TableCell>
                                    <TableCell align="right">{member.email}</TableCell>
                                    <TableCell align="right">{member.nickname}</TableCell>
                                    <TableCell align="right">{member.role}</TableCell>
                                    <TableCell align="right">{member.joinedAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={response.totalElements}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
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
                                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                                    aria-label="다음 페이지로"
                                >
                                    다음
                                </Button>
                                <Button
                                    onClick={() => onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
                                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
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
