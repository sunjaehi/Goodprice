import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import Rating from '@mui/material/Rating';
import { Link, useParams } from "react-router-dom";
import { Box, Container, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';

const defaultTheme = createTheme();
const backend = process.env.REACT_APP_BACKEND_ADDR;

function Review(props) {
    const { shopId } = useParams();
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        fetch(`${backend}/api/v1/review/?shopId=${shopId}`)
            .then(response => response.json())
            .then(data => { setReviews(data); });
    }, [shopId]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                <SpeedDial
                    ariaLabel="Review actions"
                    icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                    direction="up"
                    FabProps={{ sx: { width: 56, height: 56 } }} // 크기를 조정
                >
                    <SpeedDialAction
                        icon={<RateReviewIcon />}
                        tooltipTitle="리뷰 작성하기"
                        component={Link}
                        to={`/ReviewInput/${shopId}`}
                    />
                    <SpeedDialAction
                        icon={<PersonIcon />}
                        tooltipTitle="나의 리뷰"
                        component={Link}
                        to={`/MyReviews/${shopId}`}
                    />
                </SpeedDial>
            </Box>
            {
                reviews && reviews.map(review => {
                    return (
                        <React.Fragment key={review.id}>
                            <hr />
                            <h3>{review.writer}</h3>
                            <p>{review.comment}</p>
                            <p>{review.createdAt}</p>
                            <Rating name="read-only" value={review.score} precision={0.5} readOnly />
                            {review.attachmentIndices.length > 0 &&
                                <ImageList sx={{ width: '100%', display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                                    {review.attachmentIndices.map(index => {
                                        return (
                                            <a key={index} href={`${backend}/api/v1/attachment/${index}`} style={{ marginRight: '10px' }}>
                                                <img src={`${backend}/api/v1/attachment/${index}`} width={160} height={90} alt={`attachment-${index}`} />
                                            </a>
                                        )
                                    })}
                                </ImageList>
                            }
                        </React.Fragment>
                    )
                })
            }
        </Container>
    );
}

export default Review;