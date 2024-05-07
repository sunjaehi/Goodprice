import React,{useState,useEffect,useRef} from "react";
import {Map,MapMarker, CustomOverlayMap} from 'react-kakao-maps-sdk';
import { sampleDatas } from "../../data/sampleDatas";
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
import { sectorSample } from "../../data/sectorSample";
import { ListItemAvatar } from "@mui/material";
const { kakao }=window;


function Search() {
    const [datas, setData] = useState({});
    const [sector, setSector] = useState('');

    const handleChange = (event) => {
        setSector(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Selected sector: ",sector);
        getCoordinates();
    }
    //서버와 연결할 때는 아래에 주석을 설정하세요
    //useEffect(()=>setData(sampleDatas));
    const [state, setState]=useState({
        center : {
            lat : 37.5029087190,
            lng : 127.0377563750,
        },
        errMsg:null,
        isLoading:true,
        
    });
    const [level, setLevel]=useState(5);
    const [coordinates, setCoordinates]=useState(null);
    const mapRef = useRef();

    const getCoordinates = () => {
        const map = mapRef.current;

        setCoordinates({
            center : {
                lat:map.getCenter().getLat(),
                lng:map.getCenter().getLng(),
            },
        });
        const currentLat = map.getCenter().getLat();
        const currentLng = map.getCenter().getLng();

        //서버와 연결할 때에는 아래 주석을 해제하세요.
        
        fetch(`http://localhost:8080/api/v1/shop/?longitude=${currentLng}&latitude=${currentLat}&radius=1`)
            .then(respone => respone.json())
            .then(json => { setData(json); });
        
    };
    
    useEffect(()=> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    setState((prev)=>({
                        ...prev,
                        center : {
                            lat:position.coords.latitude,
                            lng:position.coords.longitude,
                        },
                        isLoading:false,
                    }))
                },
                (err) => {
                    setState((prev)=> ({
                        ...prev,
                        errMsg:err.message,
                        isLoading:false,
                    }))
                }
            )
        } else {
            setState((prev)=>({
                ...prev,
                errMsg:"geolocation을 사용할 수 없어요...",
                isLoading:false,
            }))
        }
    },[]);
    return (
        <div className="wrap">
            <Button color="secondary" startIcon={<MyLocationIcon />} size="large" variant="outlined" 
                    onClick={handleSubmit} 
                    sx={{borderRadius:3, width:'600px'}}>현재 위치에서 가까운 가게 찾기</Button>
            <Map
                center={state.center}
                isPanto={state.isPanto}
                style={{
                    width:"600px",
                    height:"450px",
                    margin:"10px"
                }} 
                level={level}
                ref={mapRef}
            >
    
                <CustomOverlayMap position={state.center}>
                    <div className="overlay">Here !</div>
                </CustomOverlayMap>
                {Array.from(datas).map((data)=>{
                    const latlang={
                        "lat":data.latitude,
                        "lng":data.longitude
                    }
                    return (
                        <MapMarker
                            key={`${data.id}`}
                            position={latlang}
                            image={{
                                src:"https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                size:{
                                    width:24,
                                    height:35
                                },
                            }}
                            title={data.name}
                        >
                            <div style={{padding:"1px", color:"#000"}}>
                                {data.name}
                            </div>
                        </MapMarker>);
                })}
                {!state.isLoading && (
                    <MapMarker position={state.center}>
                        <div style={{padding:"5px",color:"#000"}}>
                            {state.errMsg ? state.errMsg : "여기에 계신가요?"}
                        </div>
                    </MapMarker>
                )}
            </Map>
            <FormControl sx={{flexDirection:'row',mr:1,display:'flex'}}>
            <InputLabel id="demo-simple-select-helper-label" sx={{display:'flex',minWidth:'200px'}}>업종별 검색</InputLabel>
            <Select
                labelId='demo-simple-select-helper-label'
                id='demo-dimple-select-helper'
                value={sector}
                label="업종별"
                onChange={handleChange}
            >
                {sectorSample.map((sector)=>(
                    <MenuItem
                        value={`${sector.id}`}
                    >{`${sector.name}`}</MenuItem>
                ))}
            </Select>
            <Button 
                sx={{ml:"10px"}}
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
            <List sx={{width:'600px', maxWidth:360, bgcolor:'background.paper'}}>
                <ListItem sx={{flexDirection:'column'}}>
                    <ListItemAvatar>
                        <Avatar alt="shop1" src="https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_1280.png" />
                    </ListItemAvatar>
                    {datas.map((data)=>(
                        <ListItemButton>
                            <ListItemText
                            primary={`${data.name}`}
                            secondary={
                                <>
                                    <Typography
                                        sx={{display:'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`${data.address}`}
                                    </Typography>
                                    {`${data.phone}`}
                                </>
                                
                            }
                            
                        />
                        </ListItemButton> 
                    ))}
                    
                </ListItem>
            </List>
        </div>
    )
}
export default Search;
