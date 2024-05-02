import React,{useState,useEffect,useRef} from "react";
import {Map,MapMarker, CustomOverlayMap} from 'react-kakao-maps-sdk';
import { sampleDatas } from "../../data/sampleDatas";
import './Search.css';
const { kakao }=window;

function Search() {
    const [datas, setData] = useState({});

    //서버와 연결할 때는 아래에 주석을 설정하세요
    useEffect(()=>setData(sampleDatas));
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
        const cuurentLat = map.getCenter().getLat();
        const cuurentLng = map.getCenter().getLng();

        //서버와 연결할 때에는 아래 주석을 해제하세요.
        /*
        fetch(`http://localhost:8080/api/v1/shop/?longitude=${currentLng}&latitude=${currentLat}&radius=1`)
            .then(respone => respone.json())
            .then(json => { setData(json); });
        */
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
        <>
           <Map
                center={state.center}
                style={{
                    width:"600px",
                    height:"600px",
                    margin:"10px"
                }} 
                level={level}
                ref={mapRef}
            >
                <button onClick={getCoordinates}>현재 위치 좌표 얻기</button>
                <CustomOverlayMap position={state.center}>
                    <div className="overlay">Here !</div>
                </CustomOverlayMap>
                <button onClick={()=>setLevel(level-1)}>-</button>
                <button onClick={()=>setLevel(level+1)}>+</button>
                {Array.from(datas).map((data)=>{
                    const latlang={
                        "lat":data.latitude,
                        "lng":data.longtitude
                    }
                    return (
                        <MapMarker
                            key={`${data.id}`}
                            postion={latlang}
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
            {coordinates && (
                <div>
                    현재 위치의 좌표는..
                    <p>위도 : {coordinates.center.lat}</p>
                    <p>경도 : {coordinates.center.lng}</p>
                </div>
            )}
        </>
    )
}
export default Search;
