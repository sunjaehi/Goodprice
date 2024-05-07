import React,{useState} from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from '@mui/material/ListItemText';
import { useNavigate,BrowserRouter, Routes, Route,Link } from "react-router-dom";

function Mypage() {
    const navigate=useNavigate();
    const navigateToMyRegion = () => {
        navigate("/Myregion");
    }
    const navigateToMySector = () => {
        navigate("/Mysector");
    }
    const navigateToMyfavorite = () => {
        navigate("/Myfavorite");
    }
    const navigateToEntercorrection = () => {
        navigate("/Entercorrection");
    }

    return (
        <Box sx={{
            alignContent:"center",
            display:"flex",

        }}>
        <List>
            <ListItemButton onClick={navigateToMySector}>
                <ListItemText primary="관심 업종 관리" />
            </ListItemButton>
            <ListItemButton onClick={navigateToMyRegion}>
                <ListItemText primary="관심 지역 관리" />
            </ListItemButton>
            <ListItemButton onClick={navigateToMyfavorite}>
                <ListItemText primary="즐겨찾기 관리" />
            </ListItemButton>
            <ListItemButton onClick={navigateToEntercorrection}>
                <ListItemText primary="개인 정보 수정" />
            </ListItemButton>
            
        </List>
        </Box>
    );
    
    
    
    
}
export default Mypage;