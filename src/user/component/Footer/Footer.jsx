import React, { useState } from "react";
import './Footer.css';
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const [value, setValue] = useState('recents');

    const navigate = useNavigate();
    const navigateToFeed = () => {
        navigate("/Newsfeed");
    }
    const navigateToHome = () => {
        navigate("/");
    }
    const navigateToSearch = () => {
        navigate("/Search");
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="footer">
            <BottomNavigation sx={{bgcolor:'mistyrose', height:'6vh',width:'100%', justifyContent:'space-between'}} value={value} onChange={handleChange} >
                <BottomNavigationAction
                    label="Feed"
                    value="feed"
                    icon={<FeedOutlinedIcon />}
                    onClick={navigateToFeed}
                />
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<OtherHousesOutlinedIcon />}
                    onClick={navigateToHome}
                />
                <BottomNavigationAction
                    label="Nearby"
                    value="nearby"
                    icon={<LocationOnIcon />}
                    onClick={navigateToSearch}
                />
            </BottomNavigation>
        </div>
        
    );
}
