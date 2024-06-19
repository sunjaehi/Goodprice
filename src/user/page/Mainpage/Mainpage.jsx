import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import { Card, CardActionArea, CardContent, Typography, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../component/BottomNavigation/BottomNav';

const CarouselItem = ({ data, defaultImage, handleCardClick }) => (
    <div style={{ padding: '0 10px' }}>
        <Card sx={{ margin: '0 auto', maxWidth: 345, marginBottom: '2px', minHeight: 290 }}>
            <CardActionArea onClick={() => handleCardClick(`/detail/${data.shopId}`)}>
                <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}>
                    <img
                        src={data.imgUrl || defaultImage}
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

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", right: 25, zIndex: 1, backgroundColor: 'rgba(0,0 ,255, 0.8)', borderRadius: '50%', padding: '10px' }}
            onClick={onClick}
        >
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", left: 25, zIndex: 1, backgroundColor: 'rgba(0, 0, 255, 0.8)', borderRadius: '50%', padding: '10px' }}
            onClick={onClick}
        >
        </div>
    );
};



const CustomCarousel = ({ title, data, defaultImage, handleCardClick }) => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3, // 큰 화면에서 3개의 슬라이드를 표시
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0', // 중앙 정렬을 위해 패딩을 0으로 설정
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024, // 태블릿 크기
                settings: {
                    slidesToShow: 2,
                    centerPadding: '15%',
                    arrows: false
                }
            },
            {
                breakpoint: 768, // 모바일 크기
                settings: {
                    slidesToShow: 2,
                    centerPadding: '15%',
                    arrows: false
                }
            },
            {
                breakpoint: 480, // 작은 모바일 크기
                settings: {
                    slidesToShow: 1,
                    centerPadding: '10%',
                    arrows: false
                }
            }
        ]
    };

    return (
        <Box>
            {data.length > 0 &&
                (<Container maxWidth="lg">
                    <Typography gutterBottom variant="h6" component="div" sx={{ ml: 1 }}>
                        {title}
                    </Typography>
                </Container>)
            }
            {data.length > 1 ? (
                <Container maxWidth="lg" sx={{ padding: { xs: 0, md: 2 } }}>
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
                </Container>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {data.map((item) => (
                        <CarouselItem
                            key={item.shopId}
                            data={item}
                            defaultImage={defaultImage}
                            handleCardClick={handleCardClick}
                        />
                    ))}
                </div>
            )}
        </Box>
    );
};

const backend = process.env.REACT_APP_BACKEND_ADDR;

function Mainpage() {
    const [newShopDatas, setNewShopDatas] = useState(null);
    const [sectors, setSectors] = useState(null);
    const [bestShops, setBestShops] = useState(null);
    const [dailyShops, setDailyShops] = useState(null);
    const [bottomNavValue, setBottomNavValue] = useState(0);
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
        <>
            <Box sx={{ marginY: '64px' }}>
                {newShopDatas && (
                    <Box sx={{ mx: 0, my: 2 }}>
                        <CustomCarousel
                            title="새로 추가된 가게"
                            data={newShopDatas}
                            defaultImage={defaultImage}
                            handleCardClick={handleCardClick}
                        />
                    </Box>
                )}

                {dailyShops && (
                    <Box sx={{ mx: 0, my: 2 }}>
                        <CustomCarousel
                            title="오늘의 착한 가격 업소"
                            data={dailyShops}
                            defaultImage={defaultImage}
                            handleCardClick={handleCardClick}
                        />
                    </Box>
                )}

                <Container maxWidth="sm">
                    <Box>
                        <Typography gutterBottom variant="h6" component="div" sx={{ ml: 1 }}>
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
                </Container>
            </Box>
            <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />
        </>
    );
}

export default Mainpage;
