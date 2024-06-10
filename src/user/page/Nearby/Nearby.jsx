import React, { useState, useEffect, useRef } from "react";
import { Map, CustomOverlayMap, MapMarker } from 'react-kakao-maps-sdk';
import {
    List, ListItem, ListItemText, ListItemButton, Typography, InputLabel,
    FormControl, MenuItem, Select, Button, ListItemAvatar, SwipeableDrawer, Fab
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { sectorSample } from '../../../data/sectorSample';
import { Link } from 'react-router-dom';
import NavigationIcon from '@mui/icons-material/Navigation';
import BottomNavigation from '../../component/BottomNavigation/BottomNavigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const backend = process.env.REACT_APP_BACKEND_ADDR;
function Nearby() {
    const [datas, setData] = useState(null);
    const [sector, setSector] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();
        setSector(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        getCoordinates();
    }

    const filterData = () => {
        setFiltered(datas.filter(data => data.sectorId === sector));
        console.log(filtered);
    }

    const [state, setState] = useState({
        center: {
            lat: 37.5029087190,
            lng: 127.0377563750,
        },
        errMsg: null,
        isLoading: true,

    });
    const [level, setLevel] = useState(5);
    const [coordinates, setCoordinates] = useState(null);
    const mapRef = useRef();

    const getCoordinates = () => {
        const map = mapRef.current;

        setCoordinates({
            center: {
                lat: map.getCenter().getLat(),
                lng: map.getCenter().getLng(),
            },
        });
        const currentLat = map.getCenter().getLat();
        const currentLng = map.getCenter().getLng();

        fetch(`${backend}/api/v1/shop/?longitude=${currentLng}&latitude=${currentLat}&radius=2`)
            .then(respone => respone.json())
            .then(json => { setData(json); return json; })
            .then(json => setFiltered(json));
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setState((prev) => ({
                        ...prev,
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        isLoading: false,
                    }))
                },
                (err) => {
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }))
                }
            )
        } else {
            setState((prev) => ({
                ...prev,
                errMsg: "geolocation을 사용할 수 없어요...",
                isLoading: false,
            }))
        }
    }, []);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <div>
            <div style={{ position: 'relative', width: '100vw', height: '88vh' }}>
                <Map
                    center={state.center}
                    isPanto={state.isPanto}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    level={level}
                    ref={mapRef}
                >
                    {datas && Array.from(datas).map((data) => {
                        const latlang = {
                            "lat": data.latitude,
                            "lng": data.longitude
                        }
                        return (
                            <MapMarker
                                key={`${data.id}`}
                                position={latlang}
                                image={{
                                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                    size: {
                                        width: 24,
                                        height: 35
                                    },
                                }}
                                title={data.name}
                            >
                                <div style={{ padding: "1px", color: "#000" }}>{data.name}</div>
                            </MapMarker>);
                    })}
                    {!state.isLoading && (
                        <CustomOverlayMap position={state.center}>
                            <div style={{ padding: "5px", margin:"10px", color: "#000" ,backgroundColor:"rgba(0,0,0,0.2)", borderRadius:'10px'}}>
                                {state.errMsg ? state.errMsg : "여기에 계신가요?"}
                            </div>
                        </CustomOverlayMap>
                    )}
                </Map>
                <Button
                    
                    startIcon={<NavigationIcon />}
                    size="large"
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        borderRadius: 3,
                        mt: 1,
                        color:'black',
                        bgcolor: 'white',
                        ":hover": {
                            bgcolor: 'grey'
                        }
                    }}
                >
                    여기서 재검색
                </Button>
                <Button
                    size="large"
                    variant="contained"
                    onClick={toggleDrawer(true)}
                    sx={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        borderRadius: 3,
                        width: '200px',
                        color:'black',
                        bgcolor: 'white',
                        ":hover": {
                            bgcolor: 'grey'
                        }
                    }}
                >
                    목록 보기
                </Button>
                <Fab
                    color="primary"
                    aria-label="current location"
                    sx={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '16px',
                        zIndex: 10,
                        color:'black',
                        bgcolor: 'white',
                        ":hover": {
                            bgcolor: 'grey'
                        }
                    }}
                >
                    <MyLocationIcon />
                </Fab>
            </div>
            <SwipeableDrawer
                anchor="bottom"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                PaperProps={{
                    sx: { height: '90%' }
                }}
            >
                <div
                    role="presentation"
                    style={{ padding: '20px' }}
                >
                    <FormControl sx={{ display: 'flex', minWidth: 300, mb: 2 }} >
                        <InputLabel id="sector-label">업종</InputLabel>
                        <Select labelId='sector-label' value={sector} label="업종" onChange={handleChange}>
                            {sectorSample.map(sector => (<MenuItem value={`${sector.id}`}>{`${sector.name}`}</MenuItem>))}
                        </Select>
                        <Button
                            sx={{ mt: "10px",
                                color:'black',
                                bgcolor:"#98ABEE",
                                ":hover" : {
                                    bgcolor:"#98ABEE"
                                }
                            }}
                            variant="outlined"
                            size="small"
                            endIcon={<SendIcon />}
                            onClick={filterData}
                        >
                            업종 선택
                        </Button>
                    </FormControl>
                    <List sx={{ minWidth: 360, bgcolor: 'background.paper' }}>
                        {filtered && filtered.map((data) => (
                            <ListItem key={data.id}>
                                <ListItemButton component={Link} to={`/detail/${data.id}`} >
                                    <ListItemAvatar sx={{ width: 100, height: 100, overflow: 'hidden', marginRight: 2 }}>
                                        <img
                                            alt={data.name}
                                            src={data.imgUrl}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${data.name}`}
                                        secondary={
                                            <>
                                                <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                                    {`${data.address}`}
                                                </Typography>
                                                {data.phone.length > 5 ? <a href={`tel:${data.phone}`}>{data.phone}</a> : "연락처 정보가 없습니다"}
                                                <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                                    <img src="https://img.icons8.com/fluency/48/thumb-up.png" width={25} height={25} alt="recommendation icon" />
                                                    {data.recommend}
                                                </Typography>
                                                <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                                    {sectorSample[(Number(data.sectorId)) - 1].name}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </SwipeableDrawer>
            <BottomNavigation />
        </div >
    )
}

export default Nearby;