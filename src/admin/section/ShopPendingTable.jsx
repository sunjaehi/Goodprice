import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function ShopPendingTable() {
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [shopData, setShopData] = useState(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchShops(page);
    }, [page]);

    const fetchShops = (page) => {
        fetch(`${backend}/api/v1/shop-pending/list?page=${page}`)
            .then(result => result.json())
            .then(json => {
                setResponse(json);
                if (json && json.shops) {
                    setShopData(json.shops);
                } else {
                    setShopData([]);
                }
            });
    };

    const fetchSearchResults = (keyword, page) => {
        fetch(`${backend}/api/v1/shop/search?keyword=${keyword}&page=${page}`)
            .then(result => result.json())
            .then(json => {
                setResponse(json);
                if (json && json.shops) {
                    setShopData(json.shops);
                } else {
                    setShopData([]);
                }
            });
    };

    const handleRowClick = (shopId) => {
        navigate(`/shop-pending-detail/${shopId}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "85%"
        }}>
            <h2>등록 보류된 가게 목록</h2>
            {response &&
                <TableContainer component={Paper}>
                    <Table width="85%" sx={{ minWidth: 650, mr: "10px" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>가게 ID</TableCell>
                                <TableCell align="right">상호명</TableCell>
                                <TableCell align="right">상태</TableCell>
                                <TableCell align="right">기준</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shopData && shopData.map((shop) => (
                                <TableRow key={shop.id} onClick={() => handleRowClick(shop.id)} style={{ cursor: 'pointer' }}>
                                    <TableCell component="th" scope="row">
                                        {shop.id}
                                    </TableCell>
                                    <TableCell align="right">{shop.name}</TableCell>
                                    <TableCell align="right">{shop.status}</TableCell>
                                    <TableCell align="right">{shop.updatedAt}</TableCell>
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