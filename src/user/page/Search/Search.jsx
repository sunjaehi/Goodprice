import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import './Search.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { sectorSample } from '../../../data/sectorSample';
import { ListItemAvatar, responsiveFontSizes } from "@mui/material";
import { Link } from 'react-router-dom';

const { kakao } = window;

function Search() {
    const [datas, setData] = useState(null);
    const [sector, setSector] = useState('');

    const handleChange = (event) => {
        setSector(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Selected sector: ", sector);
        getCoordinates();
    }
    //서버와 연결할 때는 아래에 주석을 설정하세요
    //useEffect(()=>setData(sampleDatas));
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
        console.log(currentLat);
        console.log(currentLng);

        //서버와 연결할 때에는 아래 주석을 해제하세요.
        fetch(`http://localhost:8080/api/v1/shop/?longitude=${currentLng}&latitude=${currentLat}&radius=1`)
            .then(respone => respone.json())
            .then(json => { setData(json); });

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

    return (
        <div className="wrap">
            <Button color="secondary" startIcon={<MyLocationIcon />} size="large" variant="outlined"
                onClick={handleSubmit}
                sx={{ borderRadius: 3, width: '600px' }}>현재 위치에서 가까운 가게 찾기</Button>
            <Map
                center={state.center}
                isPanto={state.isPanto}
                style={{
                    width: "600px",
                    height: "450px",
                    margin: "10px"
                }}
                level={level}
                ref={mapRef}
            >

                <CustomOverlayMap position={state.center}>
                    <div className="overlay">Here !</div>
                </CustomOverlayMap>
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
                            <div style={{ padding: "1px", color: "#000" }}>
                                {data.name}
                            </div>
                        </MapMarker>);
                })}
                {!state.isLoading && (
                    <MapMarker position={state.center}>
                        <div style={{ padding: "5px", color: "#000" }}>
                            {state.errMsg ? state.errMsg : "여기에 계신가요?"}
                        </div>
                    </MapMarker>
                )}
            </Map>
            <FormControl sx={{ display: 'flex', minWidth: 300 }} >
                <InputLabel id="demo-simple-select-helper-label">업종별 검색</InputLabel>
                <Select
                    labelId='demo-simple-select-helper-label'
                    id='demo-dimple-select-helper'
                    value={sector}
                    label="업종별"
                    onChange={handleChange}
                >
                    {sectorSample.map((sector) => (
                        <MenuItem
                            value={`${sector.id}`}
                        >{`${sector.name}`}</MenuItem>
                    ))}
                </Select>
                <Button
                    sx={{ ml: "10px" }}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    endIcon={<SendIcon />}
                    type="submit"
                    onClick={handleSubmit}
                >
                    검색
                </Button>
            </FormControl>
            <List sx={{ minWidth: 360, bgcolor: 'background.paper' }}>
                {datas && datas.map((data) => (
                    <ListItem>
                        <ListItemButton component={Link} to={`/detail/${data.id}`} >
                            <ListItemAvatar sx={{ width: 100, height: 100, overflow: 'hidden', marginRight: 2 }}>
                                <img
                                    alt={data.name}
                                    src={data.imgUrl}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center'
                                    }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${data.name}`}
                                secondary={
                                    <>
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`${data.address}`}
                                        </Typography>
                                        {data.phone.length > 5 ? <a href='tel:`${ data.phone }`'>{data.phone}</a> : "연락처 정보가 없습니다"}
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            <img src="https://cdn.pixabay.com/photo/2022/12/27/13/13/icon-7680929_1280.png" width={25} height={25} />
                                            {data.recommend}

                                        </Typography>
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {sectorSample[(Number(datas[0].sectorId)) - 1].name}
                                        </Typography>
                                    </>
                                }

                            />
                        </ListItemButton>
                    </ListItem>

                ))}

            </List>
        </div >
    )
}
export default Search;
