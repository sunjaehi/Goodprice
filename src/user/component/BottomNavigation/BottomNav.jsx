import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";

export default function BottomNav({ value, onChange }) {
    const navigate = useNavigate();
    const navigateToFeed = () => {
        navigate("/Newsfeed");
    }
    const navigateToHome = () => {
        navigate("/");
    }
    const navigateToNearby = () => {
        navigate("/Nearby");
    }
    const navigateToSearch = () => {
        navigate("/search");
    }

    return (
        <BottomNavigation
            sx={{
                zIndex: 999,
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'white',
                borderTop: '1px solid #ccc',
                '&& .Mui-selected': {
                    color: 'black'
                },
            }}
            value={value}
            onChange={(event, newValue) => { onChange(newValue) }}
        >
            <BottomNavigationAction
                label="메인"
                value={0}
                icon={<OtherHousesOutlinedIcon />}
                onClick={navigateToHome}
            />
            <BottomNavigationAction
                label="피드"
                value={1}
                icon={<FeedOutlinedIcon />}
                onClick={navigateToFeed}
            />
            <BottomNavigationAction
                label="검색"
                value={2}
                icon={<Search />}
                onClick={navigateToSearch}
            />
            <BottomNavigationAction
                label="내 주변"
                value={3}
                icon={<LocationOnIcon />}
                onClick={navigateToNearby}
            />
        </BottomNavigation>
    );
}
