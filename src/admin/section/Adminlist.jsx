import React, { useState } from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import { Box } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';

export default function Adminlist() {
    const navigate = useNavigate();
    return (
        <Box sx={{
            width: "15%",
            // position:"fixed",
            // height:"100%"
        }}>
            <List
                sx={{ maxWidth: "100%", bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby='nested-list-subheader'
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        관리
                    </ListSubheader>
                }
            >
                <ListItemButton onClick={() => navigate('/Mainadmin')}>
                    <ListItemIcon>
                        <HomeOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="가게 관리" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/NoticeManage')}>
                    <ListItemIcon>
                        <AssignmentLateOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="공지사항 관리" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <MessageOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="회원 리뷰 관리" />
                </ListItemButton>
            </List>
        </Box>

    );
}