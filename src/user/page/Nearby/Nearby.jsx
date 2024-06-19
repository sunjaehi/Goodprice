import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Button, Fab, useMediaQuery } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import BottomNav from "../../component/BottomNavigation/BottomNav";
import { useTheme } from '@mui/material/styles';
import { FindReplaceOutlined } from "@mui/icons-material";
import ShopListDrawer from './ShopListDrawer';
import ShopInfoDrawer from './ShopInfoDrawer';

const backend = process.env.REACT_APP_BACKEND_ADDR;

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
    const [state, setState] = useState({
        center: { lat: 37.5029087190, lng: 127.0377563750 },
        errMsg: null,
        isLoading: true,
    });
    const [level, setLevel] = useState(5);
    const [savedCoordinates, setSavedCoordinates] = useState(null);
    const mapRef = useRef();

    const handleChange = (event) => {
        event.preventDefault();
        setSector(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        getCoordinates();
    };

    const filterData = () => {
        setFiltered(datas.filter(data => data.sectorId === sector));
    };

    const getCoordinates = () => {
        const map = mapRef.current;
        const currentLat = map.getCenter().getLat();
        const currentLng = map.getCenter().getLng();

        fetch(`${backend}/api/v1/shop/?longitude=${currentLng}&latitude=${currentLat}&radius=2`)
            .then(response => response.json())
            .then(json => {
                setData(json);
                setFiltered(json);
            });
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const initialCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setState(prev => ({
                        ...prev,
                        center: initialCenter,
                        isLoading: false,
                    }));
                    setSavedCoordinates(initialCenter); // 초기 위치 저장
                },
                (err) => {
                    setState(prev => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }));
                }
            );
        } else {
            setState(prev => ({
                ...prev,
                errMsg: "geolocation을 사용할 수 없어요...",
                isLoading: false,
            }));
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

    const handleFabClick = () => {
        if (savedCoordinates) {
            setState(prev => ({
                ...prev,
                center: savedCoordinates,
            }));
            if (mapRef.current) {
                mapRef.current.setCenter(new window.kakao.maps.LatLng(savedCoordinates.lat, savedCoordinates.lng));
            }
        }
    };

    return (
        <div>
            <div style={{ position: 'relative', width: '100vw', height: '88vh' }}>
                <Map
                    center={state.center}
                    isPanto={true}
                    style={{ width: "100%", height: "100%" }}
                    level={level}
                    ref={mapRef}
                >
                    {datas && datas.map((data) => {
                        const latlng = { lat: data.latitude, lng: data.longitude };
                        const isSelected = selectedMarkerId === data.id;
                        return (
                            <MapMarker
                                key={data.id}
                                position={latlng}
                                image={{
                                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                    size: { width: isSelected ? 48 : 24, height: isSelected ? 70 : 35 },
                                }}
                                onClick={() => handleMarkerClick(data)}
                            />
                        );
                    })}
                    {!state.isLoading && (
                        <MapMarker position={state.center}>
                            <div style={{
                                padding: "3px",
                                margin: "10px",
                                color: "#000",
                                textAlign: "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
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
                        ":hover": { bgcolor: 'grey' }
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
                        ":hover": { bgcolor: 'grey' }
                    }}
                >
                    목록 보기
                </Button>
                <Fab
                    color="primary"
                    aria-label="current location"
                    onClick={handleFabClick}
                    sx={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '16px',
                        zIndex: 10,
                        color: 'black',
                        bgcolor: 'white',
                        ":hover": { bgcolor: 'grey' }
                    }}
                >
                    <MyLocationIcon />
                </Fab>
            </div>
            <ShopListDrawer
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                isSmallScreen={isSmallScreen}
                theme={theme}
                sector={sector}
                handleChange={handleChange}
                filterData={filterData}
                filtered={filtered}
            />
            <ShopInfoDrawer
                open={infoDrawerOpen}
                onClose={toggleInfoDrawer(false)}
                onOpen={toggleInfoDrawer(true)}
                selectedShop={selectedShop}
            />
            <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />
        </div>
    );
}

export default Nearby;
