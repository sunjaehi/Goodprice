import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import Rating from '@mui/material/Rating';
import { Link, useParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
const defaultTheme = createTheme();


function Review(props) {
    const { shopId } = useParams();
    const [reviews, setReviews] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/review/?shopId=${shopId}`)
            .then(response => response.json())
            .then(data => { setReviews(data); });
    }, [])
    return (<Container maxWidth="sm">
        <Button variant="contained" component={Link} to={`/ReviewInput/${shopId}`}>리뷰 작성하기</Button>
        {
            reviews && reviews.map(review => {
                return (
                    <>
                        <hr />
                        <h3>{review.writer}</h3>
                        <p>{review.comment}</p>
                        <p>{review.createdAt}</p>
                        <Rating name="read-only" value={review.score} precision={0.5} readOnly />
                        {review.attachmentIndices.length > 0 &&
                            <ImageList sx={{ width: '100%', display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                                {review.attachmentIndices.map(index => {
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
            })
        }
    </Container>
    );
}
export default Review;

