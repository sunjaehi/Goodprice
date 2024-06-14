import React, { useState, useEffect, useRef } from "react";
import { Map, CustomOverlayMap, MapMarker } from 'react-kakao-maps-sdk';
import {
    List, ListItem, ListItemText, ListItemButton, Typography, InputLabel, useMediaQuery,
    FormControl, MenuItem, Select, Button, ListItemAvatar, SwipeableDrawer, Fab
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { sectorSample } from '../../../data/sectorSample';
import { Link } from 'react-router-dom';
import NavigationIcon from '@mui/icons-material/Navigation';
import BottomNav from "../../component/BottomNavigation/BottomNav";
import './Nearby.css';
import { styled, useTheme } from '@mui/material/styles';
import { FindReplaceOutlined } from "@mui/icons-material";

const backend = process.env.REACT_APP_BACKEND_ADDR;
const defaultImage = '/images/default_storeImage.png';

function Nearby() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));
    const [datas, setData] = useState(null);
    const [sector, setSector] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [bottomNavValue, setBottomNavValue] = useState(3);

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
            .then(response => response.json())
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

    const toggleInfoDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setInfoDrawerOpen(open);
        if (!open) {
            setSelectedMarkerId(null);
        }
    };

    const handleMarkerClick = (shop) => {
        setSelectedShop(shop);
        setSelectedMarkerId(shop.id);
        setInfoDrawerOpen(true);
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
                        const latlng = {
                            "lat": data.latitude,
                            "lng": data.longitude
                        };
                        const isSelected = selectedMarkerId === data.id;
                        return (
                            <MapMarker
                                key={`${data.id}`}
                                position={latlng}
                                image={{
                                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                    size: {
                                        width: isSelected ? 48 : 24,
                                        height: isSelected ? 70 : 35
                                    },
                                }}
                                onClick={() => handleMarkerClick(data)}
                            />
                        );
                    })}
                    {!state.isLoading && (
                        <MapMarker position={state.center} >
                            <div style={{ padding: "3px", margin: "10px", color: "#000", textAlign: "center" }}>
                                {state.errMsg ? state.errMsg : "현재 위치"}
                            </div>
                        </MapMarker>
                    )}
                </Map>
                <Button

                    startIcon={<FindReplaceOutlined />}
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
                        color: 'black',
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
                        color: 'black',
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
                        color: 'black',
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
                    sx: {
                        height: '90%',
                        maxWidth: isSmallScreen ? theme.breakpoints.values.sm : '100%',
                        margin: '0 auto',
                    }
                }}
            >
                <div
                    role="presentation"
                    style={{ padding: '20px' }}
                >
                    <FormControl sx={{ display: 'flex', minWidth: 300, mb: 2 }} >
                        <InputLabel id="sector-label">업종</InputLabel>
                        <Select labelId='sector-label' value={sector} label="업종" onChange={handleChange}>
                            {sectorSample.map(sector => (<MenuItem key={sector.id} value={`${sector.id}`}>{`${sector.name}`}</MenuItem>))}
                        </Select>
                        <Button
                            sx={{
                                mt: "10px",
                                color: 'white',
                                bgcolor: "#2a75f3",
                                ":hover": {
                                    bgcolor: "#4285f4"
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
                        <Typography variant="body1" align="center">{filtered.length}개의 가게가 있습니다.</Typography>
                        {filtered && filtered.map((data) => (
                            <ListItem key={data.id}>
                                <ListItemButton component={Link} to={`/detail/${data.id}`} >
                                    <ListItemAvatar sx={{ width: 100, height: 100, overflow: 'hidden', marginRight: 2 }}>
                                        <img
                                            src={data.imgUrl || defaultImage}
                                            alt="상점 이미지"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = defaultImage;
                                            }}
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

            <SwipeableDrawer
                anchor="bottom"
                open={infoDrawerOpen}
                onClose={toggleInfoDrawer(false)}
                onOpen={toggleInfoDrawer(true)}
                PaperProps={{
                    sx: { height: '25%' }
                }}
                ModalProps={{
                    slotProps: {
                        backdrop: {
                            style: {
                                backgroundColor: 'transparent',
                            },
                        },
                    },
                }}
            >
                {selectedShop && (
                    <div
                        role="presentation"
                        style={{ padding: '20px' }}
                    >
                        <Typography variant="h6" component="div">
                            {selectedShop.name}
                        </Typography>
                        <Typography variant="body1" component="div">
                            {selectedShop.address}
                        </Typography>
                        {selectedShop.phone.length > 5 ? (
                            <Typography variant="body1" component="div">
                                <a href={`tel:${selectedShop.phone}`}>{selectedShop.phone}</a>
                            </Typography>
                        ) : (
                            <Typography variant="body1" component="div">
                                연락처 정보가 없습니다
                            </Typography>
                        )}
                        <Typography variant="body1" component="div">
                            추천 수: {selectedShop.recommend}
                        </Typography>
                        <Typography variant="body1" component="div">
                            업종: {sectorSample[(Number(selectedShop.sectorId)) - 1].name}
                        </Typography>
                    </div>
                )}
            </SwipeableDrawer>
            <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />

        </div>
    )
}

export default Nearby;