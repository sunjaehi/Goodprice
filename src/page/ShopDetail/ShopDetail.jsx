import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Chip, Container, Paper, Tab, Tabs } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

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
        const fetchData = async () => {
            try {
                let result = await fetch(`http://localhost:8080/api/v1/shop/${shopId}`);
                if (result.status === 200) {
                    const json = await result.json();
                    setDatas(json);
                    console.log(json);

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
        console.log(sessionStorage.getItem("atk"));
        const data = JSON.stringify()
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
                            <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
                                <Tab label="홈" />
                                <Tab label="지도" />
                                <Tab label="기타 정보" />
                            </Tabs>
                            <CustomTabPanel value={value} index={0}>
                                <Typography>주소</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.address}</Typography>
                                <Typography>업종</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.sector}</Typography>
                                <Typography>연락처</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.phone.length < 5 ? "연락처 정보가 없습니다" : datas.phone}</Typography>
                                <Typography>영업시간</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {datas.businessHours && datas.businessHours.length < 5 ? "영업시간 정보가 없습니다." : datas.businessHours} (자세한 정보는 기타 정보를 참고하시길 바랍니다.)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {datas.businessHours && datas.businessHours.length >= 5 && isOpen ? "영업중입니다" : ""}
                                </Typography>
                                {datas.isLocalFranchise == 1 && (<Chip label="서울지역사랑상품권 가맹점입니다." variant="outlined" color="primary" />)}
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <Map
                                    center={state.center}
                                    isPanto={state.isPanto}
                                    style={{
                                        width: "100%",
                                        height: "450px",
                                        marginBottom: "10px",
                                        marginTop: "20px"
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
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                <Typography>기타 정보</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.info}</Typography>
                                <Typography>자랑거리</Typography>
                                <Typography variant="body2" color="text.secondary">{datas.boast}</Typography>
                            </CustomTabPanel>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={recommend}>추천</Button>
                            <Button size="small">관심 가게 목록에 추가</Button>
                        </CardActions>
                    </Card>
                    }
                </div>
                <h2>상품</h2>
                <hr />
                <List>
                    {productDatas && productDatas.map(product => {
                        return (
                            <ListItem divider>
                                <img src="https://placehold.co/100x100" />
                                <ListItemText primary={product.name} secondary={product.price} />
                            </ListItem>
                        )
                    })}
                </List>
                <h2>리뷰</h2>
                <hr />
                <List>
                    {(!reviewSummary || reviewSummary.length == 0) && <p>아직 리뷰가 없어요. 가게를 방문해보셨다면 리뷰를 남겨보세요</p>}
                    <Button variant="contained" component={Link} to={`/review/${shopId}`}>전체 리뷰보기</Button>

                    {reviewSummary && reviewSummary.map(reviewSummary => {
                        return (
                            <>
                                <ListItem divider>
                                    <img src="https://placehold.co/100x100" />
                                    <ListItemText primary={reviewSummary.comment} secondary={reviewSummary.writer} />
                                </ListItem>
                            </>
                        )
                    })}
                </List>
            </Container >
        </>
    )
}
export default ShopDetail;
