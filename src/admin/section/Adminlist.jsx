import React,{ useState } from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export default function Adminlist() {
    const [opend, setOpen] = useState(true);

    // const handleclick = () => {
    //     setOpen(!open);
    // };
    return (
        <List
            sx={{width:'50%', maxWidth:200, bgcolor:'background.paper'}}
            component="nav"
            aria-labelledby='nested-list-subheader'
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    관리
                </ListSubheader>
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="가게 관리" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <SearchOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="공지사항 관리" />
            </ListItemButton>
        </List>
    );
}