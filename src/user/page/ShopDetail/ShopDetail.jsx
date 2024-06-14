import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import {
    Card, CardActions, CardContent, Button, Typography, List, ListItem, ListItemText,
    Chip, Container, ImageList, Paper, Rating, Tab, Tabs, Box, IconButton
} from '@mui/material';
import Carousel from "react-material-ui-carousel";
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import ProductInfo from "./ProductInfo";
import ReviewSummary from "./ReviewSummary";
import ShopNewsDrawer from "./ShopNewsDrawer";

const backend = process.env.REACT_APP_BACKEND_ADDR;
const ImageContainer = styled('div')({
    width: '100%',
    height: 450,
    overflow: 'hidden',
    position: 'relative'
});

const Image = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
});

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`panel-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
};

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function ShopDetail() {
    const navigate = useNavigate();
    const [datas, setDatas] = useState(null);
    const [productDatas, setProductDatas] = useState(null);
    const [reviewSummary, setReviewSummary] = useState(null);
    const [value, setValue] = React.useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [hasRecommended, setHasRecommended] = useState(false);
    const [hasMarked, setHasMarked] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [stations, setStations] = useState(null);
    const [shopNewsDatas, setShopNewsDatas] = useState([]);
    const [hasMoreData, setHasMoreData] = useState(true);
    const atk = sessionStorage.getItem('atk');
    const { Kakao } = window;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        console.log(Kakao);
        Kakao.cleanup();
        Kakao.init('26629afca566a85d39b41a0e7760267d');
    }, []);

    const shareKakao = (datas) => {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: `${datas.shopName}`,
                description: `${datas.address}`,
                imageUrl:
                    `${datas.shopImgUrls[0]}`,
                link: {
                    mobileWebUrl: `https://good-companion.shop/detail/${datas.shopId}`,
                },
            },
            buttons: [
                {
                    title: '상세보기',
                    link: {
                        mobileWebUrl: `https://good-companion.shop/detail/${datas.shopId}`,
                    },
                },
                {
                    title: '착한동행 웹 사이트 방문',
                    link: {
                        mobileWebUrl: 'https://good-companion.shop',
                    },
                },
            ],
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { shopId } = useParams();
    const [state, setState] = useState({
        center: {
            lat: 37.5029087190,
            lng: 127.0377563750,
        },
        errMsg: null,
        isLoading: true,

    });

    useEffect(() => {
        if (latitude)
            fetch(`${backend}/api/v1/subway/?latitude=${latitude}&longitude=${longitude}`)
                .then(response => response.json())
                .then(json => { console.log(json); setStations(json) });
    }, [latitude]);

    useEffect(() => {
        const atk = sessionStorage.getItem('atk');
        if (atk !== null) {
            fetch(`${backend}/api/v1/shopRecommend/check?shopId=${shopId}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("atk")
                }
            }).then(response => response.json())
                .then(json => setHasRecommended(json));

            fetch(`${backend}/api/v1/shopmark/check?shopId=${shopId}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("atk")
                }
            }).then(response => response.json())
                .then(json => setHasMarked(json));
        }


        const fetchData = async () => {
            try {
                let result = await fetch(`${backend}/api/v1/shop/${shopId}`);
                if (result.status === 200) {
                    const json = await result.json();
                    setDatas(json);

                    if (json.businessHours != null && json.businessHours.length >= 5) {
                        const [start, end] = json.businessHours.split(' - ').map(time => {
                            const [hours, minutes] = time.split(':').map(Number);
                            const date = new Date();
                            date.setHours(hours, minutes, 0, 0);
                            return date;
                        });
                        const now = new Date();
                        setIsOpen(now >= start && now <= end);
                    }
                } else if (result.status === 404) {
                    alert("존재하지 않는 가게입니다");
                    navigate(-1);
                    return;
                }

                result = await fetch(`${backend}/api/v1/shopLocation/${shopId}`);
                let json = await result.json();
                setLatitude(json.latitude);
                setLongitude(json.longitude);
                setState({
                    center: {
                        lat: json.latitude,
                        lng: json.longitude
                    }
                });

                result = await fetch(`${backend}/api/v1/product/?shopId=${shopId}`);
                json = await result.json();
                setProductDatas(json);

                result = await fetch(`${backend}/api/v1/review/summary?shopId=${shopId}`);
                json = await result.json();
                setReviewSummary(json);

                result = await fetch(`${backend}/api/v1/shop-news/${shopId}`)
                json = await result.json();
                setShopNewsDatas(json.newsList);
                setHasMoreData(json.newsList.length > 0);
                console.log(json.newsList);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, [shopId, navigate]);

    const [level, setLevel] = useState(5);
    const mapRef = useRef();

    function recommend() {
        fetch(`${backend}/api/v1/shopRecommend/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8;',
                'Authorization': 'Bearer ' + sessionStorage.getItem("atk")
            },
            body: JSON.stringify({
                shopId: shopId
            })
        });
        setHasRecommended(true);
    }

    function unRecommend() {
        fetch(`${backend}/api/v1/shopRecommend/remove`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json; charset=utf-8;',
                'Authorization': 'Bearer ' + sessionStorage.getItem("atk")
            },
            body: JSON.stringify({
                shopId: shopId
            })
        });
        setHasRecommended(false);
    }

    function addShopMark() {
        fetch(`${backend}/api/v1/shopmark/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            },
            body: JSON.stringify({ shopId: shopId })
        });
        setHasMarked(true);
    }

    function deleteShopMark() {
        fetch(`${backend}/api/v1/shopmark/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            },
            body: JSON.stringify({ shopId: shopId })
        })
        setHasMarked(false);
    }

    const fetchMoreData = async () => {
        try {
            const result = await fetch(`${backend}/api/v1/shop-news/${shopId}?page=${page}`);
            const json = await result.json();
            if (json.newsList.length > 0) {
                setShopNewsDatas(prev => [...prev, ...json.newsList]);
                setPage(prev => prev + 1);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Failed to fetch more data:', error);
        }
    };
    return (
        <Container maxWidth="sm" sx={{ marginTop: '75px' }}>
            <div>
                {datas && <Card sx={{ width: '100%' }}>
                    <Carousel autoPlay={false} animation="slide" timeout={1000} >
                        {datas.shopImgUrls.map(url =>
                            <Paper key={url}>
                                <ImageContainer>
                                    <Image src={url} alt="이미지 준비중" />
                                </ImageContainer>
                            </Paper>
                        )}
                    </Carousel>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h5" component="div">
                                {datas.shopName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {datas.sector}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="baseline">
                            <img src="https://img.icons8.com/fluency/48/thumb-up.png" width={25} height={25} alt="recommendation icon" />
                            <Typography variant="body2" color="text.secondary" style={{ marginLeft: 4 }}>
                                {datas.recommend}
                            </Typography>
                        </Box>
                        <Rating readOnly value={datas.rate} precision={0.1} /> {datas.rate.toFixed(2)}
                        <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
                            <Tab label="홈" />
                            <Tab label="지도" />
                            <Tab label="기타 정보" />
                            <Tab
                                label={
                                    <Button onClick={() => setDrawerOpen(true)} sx={{ width: '100%', height: '100%' }}>
                                        소식
                                    </Button>
                                }
                            />
                        </Tabs>
                        <CustomTabPanel value={value} index={0}>
                            <Typography>주소</Typography>
                            <Typography variant="body2" color="text.secondary">{datas.address}</Typography>
                            <Typography>연락처</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {datas.phone.length < 5 ? "연락처 정보가 없습니다" : (<a href={`tel:${datas.phone}`}>{datas.phone}</a>)}
                            </Typography>
                            <Typography>영업시간</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {datas.businessHours && datas.businessHours.length < 5 ? "영업시간 정보가 없습니다." : datas.businessHours} <br />(자세한 시간 정보는 기타 정보를 참고하세요.)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {datas.businessHours && datas.businessHours.length >= 5 && isOpen ? "영업중입니다" : (datas.businessHours && "영업중이 아닙니다 ")}
                            </Typography>
                            <br />
                            {datas.isLocalFranchise == 1 && (<Chip label="서울사랑상품권" variant="outlined" color="primary" />)}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Map
                                center={state.center}
                                isPanto={state.isPanto}
                                style={{
                                    width: "100%",
                                    height: "500px",
                                }}
                                level={level}
                                ref={mapRef}
                            >
                                <CustomOverlayMap position={state.center}>
                                    <div className="overlay">Here !</div>
                                </CustomOverlayMap>
                                {!state.isLoading && (
                                    <MapMarker position={state.center}>
                                        <div style={{ padding: "5px", color: "#000" }}>
                                            {state.errMsg ? state.errMsg : datas && datas.shopName}
                                        </div>
                                    </MapMarker>
                                )}
                            </Map>
                            {stations && stations.length > 0 && (() => {
                                const stationGroups = stations.reduce((acc, station) => {
                                    if (!acc[station.name]) {
                                        acc[station.name] = { lines: [], distances: [] };
                                    }
                                    if (!acc[station.name].lines.includes(station.line)) {
                                        acc[station.name].lines.push(station.line);
                                    }
                                    acc[station.name].distances.push(station.distance * 1000);
                                    return acc;
                                }, {});

                                const stationAverages = Object.keys(stationGroups).map(name => {
                                    const totalDistance = stationGroups[name].distances.reduce((acc, distance) => acc + distance, 0);
                                    const averageDistance = totalDistance / stationGroups[name].distances.length;
                                    const lines = stationGroups[name].lines.join(',');
                                    return { name, lines, averageDistance: Math.round(averageDistance) };
                                });

                                return stationAverages.map((station, index) => (
                                    <p key={index}>{station.name}역({station.lines})에서 {station.averageDistance}m</p>
                                ));
                            })()}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <Typography>기타 정보</Typography>
                            <Typography variant="body2" color="text.secondary">{datas.info}</Typography>
                            <Typography>자랑거리</Typography>
                            <Typography variant="body2" color="text.secondary">{datas.boast}</Typography>
                        </CustomTabPanel>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={hasRecommended ? unRecommend : recommend} disabled={atk === null}>{hasRecommended ? "추천 해제" : "추천"}</Button>
                        <Button size="small" onClick={hasMarked ? deleteShopMark : addShopMark} disabled={atk === null} >{hasMarked ? "관심 가게 해제" : "관심 가게 추가"}</Button>
                        <Button size="small" onClick={() => { shareKakao(datas) }}>공유하기</Button>
                    </CardActions>
                </Card>
                }
            </div>
            <ProductInfo productDatas={productDatas} />
            <ReviewSummary reviewSummary={reviewSummary} shopId={shopId} />

            <ShopNewsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onOpen={() => setDrawerOpen(true)}
                shopNewsDatas={shopNewsDatas}
                fetchMoreData={fetchMoreData}
                hasMoreData={hasMoreData}
            />
        </Container>
    );
}

export default ShopDetail;
