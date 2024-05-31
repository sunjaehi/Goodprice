import { MoreVert } from "@mui/icons-material";
import { Container, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Myfavorite() {
    const navigate = useNavigate();
    const [shopMarks, setShopMarks] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedShopMark, setSelectedShopMark] = useState(null);

    useEffect(() => {
        const atk = sessionStorage.getItem('atk');
        if (atk === null) {
            alert('로그인이 필요합니다');
            navigate(-1);
        }

        fetch('http://localhost:8080/api/v1/shopmark/', {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + atk
            }
        }).then(response => {
            if (response.status === 200)
                return response.json();
            if (response.status === 401 || response.status == 403) {
                alert('권한이 없습니다');
                return;
            } else {
                alert('서버 오류');
                return;
            }
        }).then(json => setShopMarks(json));
    }, []);

    const handleMenuClick = (event, shopMark) => {
        setAnchorEl(event.currentTarget);
        setSelectedShopMark(shopMark);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedShopMark(null);
    };

    const handleShare = () => {
        if (selectedShopMark) {
            alert(selectedShopMark.shopName);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        fetch('http://localhost:8080/api/v1/shopmark/', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            },
            body: JSON.stringify({ shopId: selectedShopMark.shopId })
        }).then(response => {
            if (response.status === 200)
                alert('삭제되었습니다');
        })
        handleMenuClose();
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5">즐겨찾기</Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {shopMarks && shopMarks.map(shopMark => (
                    <ListItem key={shopMark.id} disablePadding>
                        <ListItemButton role={undefined}>
                            <ListItemText>
                                <Typography variant="h6">
                                    {shopMark.shopName}
                                </Typography>
                                <Typography variant="body2">
                                    {shopMark.shopAddress}
                                </Typography>
                            </ListItemText>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={(event) => handleMenuClick(event, shopMark)}
                            >
                                <MoreVert />
                            </IconButton>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleShare}>공유</MenuItem>
                <MenuItem onClick={handleDelete}>삭제</MenuItem>
            </Menu>
        </Container>
    );
}

export default Myfavorite;