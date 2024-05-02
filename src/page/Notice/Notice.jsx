import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';


function createData(번호, 제목, 글쓴이, 작성날짜) {
    return { 번호, 제목, 글쓴이, 작성날짜 };
}
const rows = [
    createData('Frozen yogurt',159,6.0,24),
    createData('Ice cream sandwich',237,9.0,4.3),
    createData('Eclair',262,16.0,24),
    createData('Cupcake',305,3.7,67),
    createData('Gingerbread',365,16.0,49),
];
function Notice() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth:650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>번호</TableCell>
                        <TableCell align="right">제목</TableCell>
                        <TableCell align="right">글쓴이</TableCell>
                        <TableCell align="right">작성날짜</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row)=> (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th':{border:0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.번호}
                            </TableCell>
                            <TableCell align="right">{row.제목}</TableCell>
                            <TableCell align="right">{row.글쓴이}</TableCell>
                            <TableCell align="right">{row.작성날짜}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination count={10} />
        </TableContainer>
        
    );
}
export default Notice;