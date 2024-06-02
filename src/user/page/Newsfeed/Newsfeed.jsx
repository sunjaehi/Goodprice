import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/Footer/Footer';

function Newsfeed() {
  const [itemList, setItemList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [newsList, setNewsList] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/shop-news/feed?page=${page}`, {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem('atk')
      }
    })
      .then(response => response.json())
      .then(json => setNewsList(prev => prev.concat(json)));
  }, [page])

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting && !isLoading) {
      observer.unobserve(entry.target);
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      let Items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      setItemList((itemLists) => itemLists.concat(Items));
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
  }, [target]);

  return (
    <>
      <Container maxWidth="sm">
        {newsList && newsList.map((news, index) => (
          <Card>
            <CardContent>
              <Typography variant="h6">{news.title}</Typography>
              <Typography variant='body2'>{news.content}</Typography>
            </CardContent>
          </Card>

        ))}
        {isLoading ? (
          <ReactLoading type="spin" color="#00008b" />
        ) : (
          ""
        )}
        <div ref={setTarget}></div>
      </Container>
      <Footer />
    </>
  );
}
export default Newsfeed;