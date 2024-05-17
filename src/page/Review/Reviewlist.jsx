import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import Rating from '@mui/material/Rating';
const defaultTheme = createTheme();

function Review(props) {
    const [reviews, setReviews] = useState(null);
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/review/?shopId=21151164')
            .then(response => response.json())
            .then(data => { setReviews(data); });
    }, [])
    return (<>
        <Button variant="contained">리뷰 작성하기</Button>
        {
            reviews && reviews.map(review => {
                return (
                    <div>
                        <hr />
                        <h3>{review.writer}</h3>
                        <p>{review.comment}</p>
                        <Rating name="read-only" value={review.score} precision={0.5} readOnly />
                        {review.attachmentIndices.length > 0 && <ImageList sx={{ width: 480, height: 100 }} cols={5} rowHeight={100} >
                            {review.attachmentIndices.map(index => {
                                return (
                                    <a href={`http://localhost:8080/api/v1/attachment/${index}`}>
                                        <img key={index} src={`http://localhost:8080/api/v1/attachment/${index}`} width={160} height={90} />
                                    </a>
                                )
                            })}
                        </ImageList>
                        }
                    </div >
                )
            })
        }
    </>
    );
}
export default Review;

