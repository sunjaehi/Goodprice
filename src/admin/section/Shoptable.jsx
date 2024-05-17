import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box,Stack,Typography,Button } from '@mui/material';

function createData(ID,name,status,number ,criteria) {
    return { ID,name,status,number ,criteria };
}
const rows = [
    createData('000001','북서울 한식','지정','123','2024-03'),
    createData('000002','남서울 중식','지정','546','2024-04'),
    createData('000003','동서울 일식','지정해제','4564','2024-05'),
    createData('000004','서서울 양식','지정','5465','2024-06'),
];
export default function Shoptable() {

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
        <Typography variant="h4">가게 관리</Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="contained" color="inherit" >
                신규 가게 등록
            </Button>
            <Button variant="contained" color="inherit" >
                등록 요청 관리
            </Button>
        </Stack>
        </Stack>
        <TableContainer component={Paper}>
            <Table sx={{minWidth:650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>가게 ID</TableCell>
                        <TableCell align="right">상호명</TableCell>
                        <TableCell align="right">상태</TableCell>
                        <TableCell align="right">추천수</TableCell>
                        <TableCell align="right">기준</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th':{border:0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.ID}
                            </TableCell>
                            <TableCell align='right'>{row.name}</TableCell>
                            <TableCell align='right'>{row.status}</TableCell>
                            <TableCell align='right'>{row.number}</TableCell>
                            <TableCell align='right'>{row.criteria}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Box>
        
    )
}