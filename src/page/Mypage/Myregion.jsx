import React, { useState } from "react";
import Table from '@mui/material/Table';
import { TableBody } from "@mui/material/TableBody";
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { regionSample } from "../../data/regionSample";
import FormLabel from "@mui/material/FormLabel";

function Myregion() {
    const [region,setRegion] = useState('');
    const handleChange = (event) => {
        setRegion(event.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("selected region :", region);
    }
    return (
        <FormGroup sx={{
            alignContent:"center",
            display:"flex",
            }}
            onSubmit={handleSubmit}
        >
            <FormLabel sx={{
                
            }}>관심 지역 관리</FormLabel>
            <Button 
                variant="outlined" 
                type="submit" 
                onClick={handleSubmit}
            >수정</Button>
            {regionSample.map((region)=> (
                <FormControlLabel 
                    control={<Switch />} 
                    value={`${region.id}`} 
                    label={`${region.name}`} 
                    labelPlacement="start"
                    onChange={handleChange}
                />
            ))}
        </FormGroup>
    );
}
export default Myregion;