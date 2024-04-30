import styled from "styled-components";
import React,{useState} from "react";
import './Header.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate,BrowserRouter, Routes, Route,Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Mymodal from "../../page/Modal/Mymodal";


function Header () {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const DrawerList = (
        
        <Box 
            sx={{width:200}}
            role="presentation"
            onClick={toggleDrawer(false)}>
                <List>
                    {['홈','공지','혜택','지역별 착한가게'].map((text) => (
                        <ListItem key={text} disablePadding
                        sx={{'&:hover':{
                            backgroundColor:'lightgray'
                           },
                           pb:2}}>
                        <ListItemText primary={text} />
                        </ListItem>
                        
                    ))}
                </List>
        </Box>
    )
    
    return (
        <div className="head">
            <div className="one">
            <Button 
                sx={{textDecoration:'none', color:'inherit'}}
                onClick={toggleDrawer(true)}><MenuIcon /></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            </div>
            <Link to="/" className="link">
                <h1 className="name">Title</h1>
            </Link>
            <Mymodal />
            
        </div>
   
    );
}
export default Header;