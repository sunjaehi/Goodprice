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
             <BottomNavigation sx={{bgcolor:'#98ABEE', height:'6vh',width:'100%', justifyContent:'space-between',
                '&& .Mui-selected' : {
                    color:'white'
                }
            }} value={value} onChange={handleChange} >
                <BottomNavigationAction
                    label="피드"
                    value="feed"
                    icon={<FeedOutlinedIcon />}
                    onClick={navigateToFeed}
                />
                <BottomNavigationAction
                    label="메인"
                    value="home"
                    icon={<OtherHousesOutlinedIcon />}
                    onClick={navigateToHome}
                />
                <BottomNavigationAction
                    label="내 주변"
                    value="nearby"
                    icon={<LocationOnIcon />}
                    onClick={navigateToSearch}
                />
            </BottomNavigation>
        </div>
        
    );
}
