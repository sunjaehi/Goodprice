import React, { useState } from "react";
import './BottomNav.css';
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";

export default function BottomNav() {
    const [value, setValue] = useState('recents');

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

    const handleChange = (event, newValue) => {
        
        setValue(newValue);
    };

    return (
        <div className="footer">
            <BottomNavigation sx={{
                bgcolor: 'white', height: '6vh', width: '100%', justifyContent: 'space-between',
                '&& .Mui-selected': {
                    color: 'black'
                },
            }} value={value} onChange={handleChange}>
                <BottomNavigationAction
                    label="메인"
                    value="home"
                    icon={<OtherHousesOutlinedIcon />}
                    onClick={navigateToHome}
                />

                <BottomNavigationAction
                    label="피드"
                    value="feed"
                    icon={<FeedOutlinedIcon />}
                    onClick={navigateToFeed}

                />

                <BottomNavigationAction
                    label="검색"
                    value="search"
                    icon={<Search />}
                    onClick={navigateToSearch}
                />

                <BottomNavigationAction
                    label="내 주변"
                    value="nearby"
                    icon={<LocationOnIcon />}
                    onClick={navigateToNearby}
                />
            </BottomNavigation>
        </div>

    );
}
