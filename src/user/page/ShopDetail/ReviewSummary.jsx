import { Box, Button, Card, CardContent, ImageList, List, Rating, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export default function ReviewSummary({ reviewSummary, shopId }) {
    return (
        <>
            <h2>리뷰</h2>
            <List>
                {(!reviewSummary || reviewSummary.length == 0) && <p>아직 리뷰가 없어요. 가게를 방문해보셨다면 리뷰를 남겨보세요</p>}
                <Button variant="contained" sx={{
                    mt: 3, mb: 2, backgroundColor: '#2a75f3',
                    ":hover": {
                        backgroundColor: '#4285f4'
                    }
                }} component={Link} to={`/review/${shopId}`}>전체 리뷰보기</Button>

                {reviewSummary && reviewSummary.map(review => {
                    return (
                        <Card key={review.id} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">{review.memberNickname}</Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary">{review.createdAt}</Typography>
                                <Typography variant="body1" paragraph>{review.comment}</Typography>
                                <Rating name="read-only" value={review.score} precision={0.5} readOnly />
                                {review.imgUrls && review.imgUrls.length > 0 &&
                                    <ImageList sx={{ width: '100%', display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                                        {review.imgUrls.map(imgurl => {
                                            return (
                                                <a href={imgurl} style={{ marginRight: '10px' }}>
                                                    <img
                                                        src={imgurl}
                                                        width={100}
                                                        height={100}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </a>
                                            )
                                        })}
                                    </ImageList>
                                }
                            </CardContent>
                        </Card>
                    )
                })}
            </List>
        </>
    )
}