import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import { Card, CardActionArea, CardContent, Typography, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../component/BottomNavigation/BottomNav';

const CarouselItem = ({ data, defaultImage, handleCardClick }) => (
    <div style={{ padding: '0 10px' }}>
        <Card sx={{ margin: '0 auto', maxWidth: 345, marginBottom: '3px', minHeight: 310 }}>
            <CardActionArea onClick={() => handleCardClick(`/detail/${data.shopId}`)}>
                <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}>
                    <img
                        src={data.imgUrl}
                        alt="상점 이미지"
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultImage;
                        }}
                    />
                </div>
                <CardContent>
                    <Typography variant="h5">{data.name}</Typography>
                    <Typography variant="body1">{data.address}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </div>
);

const CustomCarousel = ({ title, data, defaultImage, handleCardClick }) => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '80px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 480,
                settings: {
                    centerPadding: '20px',
                }
            }
        ]
    };

    return (
        <Box my={4}>
            <Typography gutterBottom variant="h6" component="div">
                {title}
            </Typography>
            <Slider {...settings}>
                {data.map((item) => (
                    <CarouselItem
                        key={item.shopId}
                        data={item}
                        defaultImage={defaultImage}
                        handleCardClick={handleCardClick}
                    />
                ))}
            </Slider>
        </Box>
    );
};

const backend = process.env.REACT_APP_BACKEND_ADDR;

function Mainpage() {
    const [newShopDatas, setNewShopDatas] = useState(null);
    const [sectors, setSectors] = useState(null);
    const [bestShops, setBestShops] = useState(null);
    const [dailyShops, setDailyShops] = useState(null);

    const defaultImage = '/images/default_storeImage.png';

    const navigate = useNavigate();

    const handleCardClick = (link) => {
        navigate(link);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectorResponse = await fetch(`${backend}/api/v1/sector/`);
                const sectorData = await sectorResponse.json();
                setSectors(sectorData);
                const bestShopsPromise = fetch(`${backend}/api/v1/shop/best`).then(result => result.json());
                const newShopPromise = fetch(`${backend}/api/v1/newShop/`).then(result => result.json());
                const dailyShopPromise = fetch(`${backend}/api/v1/dailyShop/`).then(result => result.json());
                const [bestShopsData, newShopData, dailyShopData] = await Promise.all([bestShopsPromise, newShopPromise, dailyShopPromise]);
                setBestShops(bestShopsData);
                setNewShopDatas(newShopData);
                setDailyShops(dailyShopData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth="sm">
            {newShopDatas && (
                <CustomCarousel
                    title="새로 추가된 가게"
                    data={newShopDatas}
                    defaultImage={defaultImage}
                    handleCardClick={handleCardClick}
                />
            )}

            {dailyShops && (
                <CustomCarousel
                    title="오늘의 착한 가격 업소"
                    data={dailyShops}
                    defaultImage={defaultImage}
                    handleCardClick={handleCardClick}
                />
            )}

            <Box my={4}>
                <Typography gutterBottom variant="h5" component="div">
                    업종별 베스트 가게
                </Typography>
                <Grid container spacing={2}>
                    {bestShops && bestShops.map(bestShop => (
                        <Grid item xs={12} sm={6} md={6} key={bestShop.shopId}>
                            <Typography variant="body2" color="text.secondary">
                                {sectors && sectors.find(sector => sector.id === bestShop.sector)?.name}
                            </Typography>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(`/detail/${bestShop.shopId}`)}>
                                    <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}>
                                        <img
                                            src={bestShop.imgUrl}
                                            alt="상점 이미지"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = defaultImage;
                                            }}
                                        />
                                    </div>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {bestShop.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {bestShop.address}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <BottomNav />
        </Container>
    );
}

export default Mainpage;