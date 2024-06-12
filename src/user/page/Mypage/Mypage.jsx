import React from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
    },
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: theme.palette.action.selected,
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
    },
}));

function Mypage() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                <Typography variant="h5">마이페이지</Typography>
                <Typography variant="subtitle1">개인 정보 및 설정을 관리하세요.</Typography>
            </Box>
            <List>
                <ListItem disablePadding>
                    <CustomListItemButton onClick={() => handleNavigation("/Myregion")} divider>
                        <ListItemIcon>
                            <HomeIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="관심 지역 관리"
                            primaryTypographyProps={{
                                variant: 'body1'
                            }}
                        />
                    </CustomListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <CustomListItemButton onClick={() => handleNavigation("/Myfavorite")} divider>
                        <ListItemIcon>
                            <FavoriteBorderIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="즐겨찾기 관리"
                            primaryTypographyProps={{
                                variant: 'body1'
                            }}
                        />
                    </CustomListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <CustomListItemButton onClick={() => handleNavigation("/Entercorrection")} divider>
                        <ListItemIcon>
                            <EditIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="닉네임 변경"
                            primaryTypographyProps={{
                                variant: 'body1'
                            }}
                        />
                    </CustomListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <CustomListItemButton onClick={() => handleNavigation("/change-password")} divider>
                        <ListItemIcon>
                            <LockIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="비밀번호 변경"
                            primaryTypographyProps={{
                                variant: 'body1'
                            }}
                        />
                    </CustomListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <CustomListItemButton onClick={() => handleNavigation("/Entercorrection")} divider>
                        <ListItemIcon>
                            <NotificationsIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="알림 설정"
                            primaryTypographyProps={{
                                variant: 'body1'
                            }}
                        />
                    </CustomListItemButton>
                </ListItem>
            </List>
        </Container>
    );
}
export default Mypage;