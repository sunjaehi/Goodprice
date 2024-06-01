import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import {
    Card, CardActions, CardContent, Button, Typography, List, ListItem, ListItemText,
    Chip, Container, ImageList, Paper, Rating, Tab, Tabs, Box
} from '@mui/material';
import Carousel from "react-material-ui-carousel";
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
const { kakao } = window;
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
    const atk = sessionStorage.getItem('atk');

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
        fetch(`http://localhost:8080/api/v1/subway/?latitude=${latitude}&longitude=${longitude}`)
            .then(response => response.json())
            .then(json => { console.log(json); setStations(json) });
    }, [latitude]);

    useEffect(() => {
        const atk = sessionStorage.getItem('atk');
        if (atk !== null) {
            fetch(`http://localhost:8080/api/v1/shopRecommend/check?shopId=${shopId}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("atk")
                }
            }).then(response => response.json())
                .then(json => setHasRecommended(json));

            fetch(`http://localhost:8080/api/v1/shopmark/check?shopId=${shopId}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("atk")
                }
            }).then(response => response.json())
                .then(json => setHasMarked(json));
        }


        const fetchData = async () => {
            try {
                let result = await fetch(`http://localhost:8080/api/v1/shop/${shopId}`);
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

                result = await fetch(`http://localhost:8080/api/v1/shopLocation/${shopId}`);
                let json = await result.json();
                setLatitude(json.latitude);
                setLongitude(json.longitude);
                setState({
                    center: {
                        lat: json.latitude,
                        lng: json.longitude
                    }
                });

                result = await fetch(`http://localhost:8080/api/v1/product/?shopId=${shopId}`);
                json = await result.json();
                setProductDatas(json);

                result = await fetch(`http://localhost:8080/api/v1/review/summary?shopId=${shopId}`);
                json = await result.json();
                setReviewSummary(json);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, [shopId, navigate]);

    const [level, setLevel] = useState(5);
    const mapRef = useRef();

    function recommend() {
        fetch("http://localhost:8080/api/v1/shopRecommend/register", {
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
        fetch("http://localhost:8080/api/v1/shopRecommend/remove", {
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
        fetch('http://localhost:8080/api/v1/shopmark/', {
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
        fetch('http://localhost:8080/api/v1/shopmark/', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            },
            body: JSON.stringify({ shopId: shopId })
        })
        setHasMarked(false);
    }

    return (
        <>
            <Container maxWidth="sm">
                <div>
                    {datas && <Card sx={{ width: '100%' }}>
                        <Carousel autoPlay={false} animation="slide" timeout={1000}>
                            {datas.shopImgUrls.map(url =>
                                <Paper>
                                    <ImageContainer>
                                        <Image src={url} alt="이미지 준비중" />
                                    </ImageContainer>
                                </Paper>
                            )}
                        </Carousel>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {datas.shopName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">{datas.sector}</Typography>
                            <ThumbUpIcon />{datas.recommend}<br />
                            <Rating readOnly value={datas.rate} precision={0.1} /> {datas.rate.toFixed(2)}
                            <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
                                <Tab label="홈" />
                                <Tab label="지도" />
                                <Tab label="기타 정보" />
                            </Tabs>
                            <CustomTabPanel value={value} index={0}>
                                <Typography>주소</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.address}</Typography>
                                <Typography>연락처</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.phone.length < 5 ? "연락처 정보가 없습니다" : datas.phone}</Typography>
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
                                {stations.length > 0 && stations.map(station => (
                                    <p>{station.name}역에서 {parseInt(station.distance * 1000)}m</p>
                                ))}
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
                            <Button size="small" onClick={hasMarked ? deleteShopMark : addShopMark} disabled={atk === null} >{hasMarked ? "관심 가게 추가" : "관심 가게 해제"}</Button>
                        </CardActions>
                    </Card>
                    }
                </div>
                <h2>상품</h2>
                <hr />
                <List>
                    {(!productDatas || productDatas.length === 0) && <p>아직 상품이 없어요</p>}
                    {productDatas && productDatas.map(product => {
                        return (
                            <ListItem divider>
                                {product.imgUrl && (
                                    <img
                                        src={product.imgUrl}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            overflowX: 'auto',
                                            marginRight: '16px'
                                        }}
                                        alt="상품 이미지"
                                    />
                                )}
                                <ListItemText primary={product.name} secondary={product.price} />
                            </ListItem>
                        )
                    })}
                </List>
                <h2>리뷰</h2>
                <List>
                    {(!reviewSummary || reviewSummary.length == 0) && <p>아직 리뷰가 없어요. 가게를 방문해보셨다면 리뷰를 남겨보세요</p>}
                    <Button variant="contained" component={Link} to={`/review/${shopId}`}>전체 리뷰보기</Button>

                    {reviewSummary && reviewSummary.map(reviewSummary => {
                        return (
                            <>
                                <hr />
                                <h3>{reviewSummary.writer}</h3>
                                <p>{reviewSummary.comment}</p>
                                <p>{reviewSummary.createdAt}</p>
                                <Rating name="read-only" value={reviewSummary.score} precision={0.5} readOnly />
                                {reviewSummary.attachmentIndices.length > 0 &&
                                    <ImageList sx={{ width: '100%', display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                                        {reviewSummary.attachmentIndices.map(index => {
                                            return (
                                                <a key={index} href={`http://localhost:8080/api/v1/attachment/${index}`} style={{ marginRight: '10px' }}>
                                                    <img src={`http://localhost:8080/api/v1/attachment/${index}`} width={160} height={90} />
                                                </a>
                                            )
                                        })}
                                    </ImageList>
                                }
                            </>
                        )
                    })}
                </List>
            </Container >
        </>
    )
}
export default ShopDetail;
