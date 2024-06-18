import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, Link } from "react-router-dom";
import Mymodal from "../Modal/Mymodal";
import Loginmodal from "../Modal/Loginmodal";
import Adminmodal from "../Modal/Adminmodal";

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
        <AppBar position="fixed" sx={{ backgroundColor: '#1266f1' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    <Typography variant="h5">착한 동행</Typography>
                </Link>
                <>
                    {(admin === 'ROLE_USER') ? (<Loginmodal />)
                        : (admin === 'ROLE_ADMIN') ? (<Adminmodal />)
                            : (<Mymodal />)
                    }
                </>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
