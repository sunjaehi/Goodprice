import React, { useState, useEffect, useRef } from 'react';
import ReactLoading from 'react-loading';
import { Card, CardContent, Container, Typography } from '@mui/material';
import BottomNav from '../../component/BottomNavigation/BottomNav';

const backend = process.env.REACT_APP_BACKEND_ADDR;
function Newsfeed() {
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [newsList, setNewsList] = useState([]);
  const [newsResponse, setNewsResponse] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (isLastPage) return; // 마지막 페이지면 요청을 보내지 않음

    fetch(`${backend}/api/v1/shop-news/feed?page=${page}`, {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem('atk')
      }
    })
      .then(response => response.json())
      .then(json => {
        setNewsResponse(json);
        return json; // 다음 then 블록에서 json을 사용하기 위해 반환
      })
      .then(json => {
        if (json && json.newsList) { // json과 json.newsList가 유효한지 확인
          setNewsList(prev => prev.concat(json.newsList));
          setIsLastPage(json.lastPage); // json.lastPage를 사용하여 isLastPage 설정
        }
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, [page, isLastPage]);

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting && !isLoading && !isLastPage) {
      observer.unobserve(entry.target);
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPage((prev) => prev + 1);
      setIsLoading(false);
      observer.observe(entry.target);
    }
  };
  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.8,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target, newsResponse]);

  return (
    <>
      <Container maxWidth="sm">
        {newsList && newsList.map((news, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h6">{news.title}</Typography>
              <Typography variant='body2'>{news.content}</Typography>
            </CardContent>
          </Card>
        ))}
        {isLoading && !isLastPage ? (
          <ReactLoading type="spin" color="#00008b" />
        ) : (
          ""
        )}
        <div ref={setTarget}></div>
      </Container>
      <BottomNav />
    </>
  );
}
export default Newsfeed;