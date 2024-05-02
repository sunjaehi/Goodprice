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
    const List =(
        <>
        <List>
            <ListItemButton onClick={navigateToMySector}>
                <ListItemText primary="관심 업종 관리" />
            </ListItemButton>
            <ListItemButton onClick={navigateToMyRegion}>
                <ListItemText primary="관심 지역 관리" />
            </ListItemButton>
        </List>
    </>
    )
    return (
        <>
            <List />
        </>
    )
    
    
    
}
export default Mypage;