import React, { useState, useEffect, useRef } from 'react';
import ReactLoading from 'react-loading';
import { Card, CardContent, Container, Typography, Fab, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BottomNav from '../../component/BottomNavigation/BottomNav';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { styled } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CreateIcon from '@mui/icons-material/Create';
import ListIcon from '@mui/icons-material/List';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';

const backend = process.env.REACT_APP_BACKEND_ADDR;

const ImageContainer = styled('div')({
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'relative'
});

const Image = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
});

function Newsfeed() {
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [newsList, setNewsList] = useState([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const [bottomNavValue, setBottomNavValue] = useState(1);
    const [permittedShops, setPermittedShops] = useState([]);
    const [isManagingShops, setIsManagingShops] = useState(false);
    const [myShopNews, setMyShopNews] = useState([]);
    const [myShopPage, setMyShopPage] = useState(0);
    const [isMyShopLastPage, setIsMyShopLastPage] = useState(false);
    const atk = sessionStorage.getItem('atk');
    const navigate = useNavigate();
    const observerRef = useRef();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isLastPage || !atk) return;

        const fetchNews = async () => {
            try {
                const response = await fetch(`${backend}/api/v1/shop-news/feed?page=${page}`, {
                    headers: {
                        "Authorization": `Bearer ${atk}`
                    }
                });
                const json = await response.json();
                setNewsList(prev => prev.concat(json.newsList));
                setIsLastPage(json.lastPage);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setIsLoading(false);
            }
        };

        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchNews();
        } else if (isLoading && !isManagingShops) {
            fetchNews();
        }
    }, [page, atk, isLastPage, isLoading, isManagingShops]);

    useEffect(() => {
        if (!atk) return;

        const fetchPermissions = async () => {
            try {
                const response = await fetch(`${backend}/api/v1/shop-manager/check-permissions`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${atk}`
                    }
                });
                const json = await response.json();
                setPermittedShops(json);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, [atk]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && (!isLastPage || !isMyShopLastPage)) {
                    setIsLoading(true);
                    if (isManagingShops) {
                        setMyShopPage((prev) => prev + 1);
                    } else {
                        setPage((prev) => prev + 1);
                    }
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [isLoading, isManagingShops, isLastPage, isMyShopLastPage]);

    useEffect(() => {
        if (!isLoading || !isManagingShops || isMyShopLastPage) return;

        const fetchMyShopNews = async () => {
            try {
                const response = await fetch(`${backend}/api/v1/shop-news/list-my-shop-news?page=${myShopPage}`, {
                    headers: {
                        "Authorization": `Bearer ${atk}`
                    }
                });
                const json = await response.json();
                setMyShopNews(prev => prev.concat(json.newsList));
                setIsMyShopLastPage(json.lastPage);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching my shop news:', error);
                setIsLoading(false);
            }
        };

        fetchMyShopNews();
    }, [isLoading, myShopPage, atk, isManagingShops, isMyShopLastPage]);

    const handleSpeedDialAction = async (action) => {
        if (action === 'create') {
            navigate('/shop-news-input');
        } else if (action === 'manage') {
            setIsManagingShops(true);
            setIsLoading(true);
        } else if (action === 'back') {
            setIsManagingShops(false);
        }
    };

    const handleDelete = (id) => {
        fetch(`${backend}/api/v1/shop-news/${id}`, { method: "DELETE" })
            .then(response => {
                if (response.status === 200) alert('삭제되었습니다');
            });
    };

    const renderNewsList = (newsList, isManaging) => (
        newsList.map((news, index) => (
            <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body" color="text.secondary">{news.shopName}</Typography>
                        {isManaging && (
                            <IconButton onClick={() => handleDelete(news.id)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant="h6">{news.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{news.content}</Typography>
                    {news.imgUrls && news.imgUrls.length > 0 && (
                        <Carousel autoPlay={false} animation="slide" timeout={1000}>
                            {news.imgUrls.map((url, idx) => (
                                <ImageContainer key={idx}>
                                    <Image src={url} alt={`뉴스 이미지 ${idx + 1}`} />
                                </ImageContainer>
                            ))}
                        </Carousel>
                    )}
                </CardContent>
            </Card>
        ))
    );

    if (atk === null) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '85vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant='h6'>로그인 후 관심 가게의 새 소식을 받아보세요.</Typography>
                <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />
            </Box>
        );
    }

    return (
        <>
            <Container maxWidth="sm">
                {isManagingShops ? (
                    myShopNews.length > 0 ? renderNewsList(myShopNews, true) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '85vh',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant='h6'>새 소식이 없어요.</Typography>
                            <Typography variant='body2'>새 소식을 추가해보세요.</Typography>
                        </Box>
                    )
                ) : (
                    newsList.length > 0 ? renderNewsList(newsList, false) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '85vh',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant='h6'>새 소식이 없어요.</Typography>
                            <Typography variant='body2'>관심 가게를 추가하고 새 소식을 받아보세요.</Typography>
                        </Box>
                    )
                )}
                {isLoading && !isLastPage && !isMyShopLastPage && (
                    <ReactLoading type="spin" color="#00008b" />
                )}
                <div ref={observerRef}></div>
            </Container>
            {permittedShops.length > 0 && (
                <SpeedDial
                    ariaLabel="SpeedDial example"
                    sx={{ position: 'fixed', bottom: 80, right: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<CreateIcon />}
                        tooltipTitle="새 소식 작성"
                        onClick={() => handleSpeedDialAction('create')}
                    />
                    <SpeedDialAction
                        icon={isManagingShops ? <HomeIcon /> : <ListIcon />}
                        tooltipTitle={isManagingShops ? "뉴스피드" : "내가 관리하는 가게 소식 모음"}
                        onClick={() => handleSpeedDialAction(isManagingShops ? 'back' : 'manage')}
                    />
                </SpeedDial>
            )}
            <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />
        </>
    );
}

export default Newsfeed;
