import React, { useState, useEffect, useRef } from 'react';
import ReactLoading from 'react-loading';
import { Card, CardContent, Container, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BottomNav from '../../component/BottomNavigation/BottomNav';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

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
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchNews();
    }
  }, [page, atk, isLastPage]);

  const [isFirst, setFirst] = useState(true);

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
        if (entries[0].isIntersecting && !isLoading && !isLastPage) {
          setIsLoading(true);
          setPage((prev) => prev + 1);
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
  }, [isLoading, isLastPage]);

  useEffect(() => {
    if (!isLoading) return;
    const fetchMoreNews = async () => {
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
        console.error('Error fetching more news:', error);
        setIsLoading(false);
      }
    };

    fetchMoreNews();
  }, [isLoading, page, atk]);

  return (
    <>
      <Container maxWidth="sm">
        {newsList.map((news, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body" color="text.secondary">{news.shopName}</Typography>
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
        ))}
        {isLoading && !isLastPage && (
          <ReactLoading type="spin" color="#00008b" />
        )}
        <div ref={observerRef}></div>
      </Container>
      {permittedShops.length > 0 && (
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', bottom: 80, right: 16 }}
          onClick={() => navigate('/shop-news-input')}
        >
          <AddIcon />
        </Fab>
      )}
      <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />
    </>
  );
}

export default Newsfeed;
