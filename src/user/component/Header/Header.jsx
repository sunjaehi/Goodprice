import React, { useState } from "react";
import './Header.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import Mymodal from "../Modal/Mymodal";
import Loginmodal from "../Modal/Loginmodal";
import Adminmodal from "../Modal/Adminmodal";
import { Typography } from "@mui/material";


function Header() {
    const [open, setOpen] = useState(false);
    const admin = sessionStorage.getItem('role');

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const navigate = useNavigate();
    const navigateToNotice = () => {
        navigate("/Notice");
    }
    const navigateToHome = () => {
        navigate("/");
    }
    const navigateToShopList = () => {
        navigate("/shop-list");
    }
    const navigateToServicecenter = () => {
        navigate("/Servicecenter");
    }
    const DrawerList = (
        <Box
            sx={{ width: 200 }}
            role="presentation"
            onClick={toggleDrawer(false)}>
            <List>
                <ListItemButton onClick={navigateToHome}>
                    <ListItemText primary="홈" />
                </ListItemButton>
                <ListItemButton onClick={navigateToNotice}>
                    <ListItemText primary="공지" />
                </ListItemButton>
                <ListItemButton onClick={navigateToShopList}>
                    <ListItemText primary="가게 목록" />
                </ListItemButton>
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={navigateToServicecenter}>
                    <ListItemText primary="고객센터" />
                </ListItemButton>
            </List>
        </Box>
    )

    return (
        <div className="head">
            <div className="one">
                <Button
                    sx={{ textDecoration: 'none', color: 'white' }}
                    onClick={toggleDrawer(true)}><MenuIcon /></Button>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            </div>
            <Link to="/" className="link">
                <Typography color='white' variant="h5">착한 동행</Typography>
            </Link>
            <>
                {(admin === 'ROLE_USER') ? (<Loginmodal />)
                    : (admin === 'ROLE_ADMIN') ? (<Adminmodal />)
                        : (<Mymodal />)
                }
            </>
        </div>

    );
}
export default Header;