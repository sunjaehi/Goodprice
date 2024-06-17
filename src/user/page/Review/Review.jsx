import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import Rating from '@mui/material/Rating';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Container, SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton, Menu, MenuItem, Card, Typography, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupIcon from '@mui/icons-material/Group';

const defaultTheme = createTheme();
const backend = process.env.REACT_APP_BACKEND_ADDR;

function Review(props) {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [myReviewMode, setMyReviewMode] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (myReviewMode === false) {
            fetch(`${backend}/api/v1/review/?shopId=${shopId}`)
                .then(response => response.json())
                .then(data => { setReviews(data); });
        }
        else if (myReviewMode === true) {
            fetch(`${backend}/api/v1/review/my-review?shopId=${shopId}`, {
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('atk')
                }
            })
                .then(response => response.json())
                .then(data => { setReviews(data); });
        }
    }, [shopId, myReviewMode]);

    const handleMenuOpen = (event, reviewId) => {
        setAnchorEl(event.currentTarget);
        setSelectedReviewId(reviewId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReviewId(null);
    };

    const handleEdit = (reviewId) => {
        navigate(`/edit-review?reviewId=${reviewId}`);
        handleMenuClose();
    };

    const handleDelete = (reviewId) => {
        fetch(`${backend}/api/v1/review/${reviewId}`, {
            method: "DELETE"
        }).then(response => {
            if (response.status === 200)
                alert('리뷰 삭제 완료');
            else
                alert('리뷰 삭제 실패');
        })
        handleMenuClose();
    };

    const handleReviewWrite = () => {
        const atk = sessionStorage.getItem('atk');
        if (!atk) {
            setDialogOpen(true);
        } else {
            navigate(`/ReviewInput/${shopId}`);
        }
    };

    const handleMyReview = () => {
        const atk = sessionStorage.getItem('atk');
        if (!atk) {
            setDialogOpen(true);
        } else {
            setMyReviewMode(!myReviewMode);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirm = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 12 }}>
            <Button
                onClick={() => navigate(`/detail/${shopId}`)}
                variant="outlined"
                fullWidth
                sx={{ textAlign: 'center' }}
            >
                가게 정보로 돌아가기
            </Button>
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
                        onClick={handleReviewWrite}
                    />
                    <SpeedDialAction
                        icon={myReviewMode ? <GroupIcon /> : <PersonIcon />}
                        tooltipTitle="나의 리뷰"
                        onClick={handleMyReview}
                    />
                </SpeedDial>
            </Box>
            {
                reviews && reviews.length > 0 ? (
                    reviews.map(review => {
                        return (
                            <Card key={review.id} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6">{review.memberNickname}</Typography>
                                        {(review.memberId == sessionStorage.getItem('id') || sessionStorage.getItem('role') === 'ROLE_ADMIN')
                                            &&
                                            <IconButton onClick={(event) => handleMenuOpen(event, review.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
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
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedReviewId === review.id}
                                    onClose={handleMenuClose}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                                >
                                    {review.memberId == sessionStorage.getItem('id') && (
                                        <MenuItem onClick={() => handleEdit(review.id)}>수정</MenuItem>
                                    )}
                                    {(review.memberId == sessionStorage.getItem('id') || sessionStorage.getItem('role') === 'ROLE_ADMIN') && (
                                        <MenuItem onClick={() => handleDelete(review.id)}>삭제</MenuItem>
                                    )}
                                </Menu>
                            </Card>
                        )
                    })
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant='h6'>아직 리뷰가 없어요.</Typography>
                    </Box>
                )
            }
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle>로그인 필요</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        로그인 후 사용할 수 있는 기능입니다. 로그인 하시겠어요?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>아니오</Button>
                    <Button onClick={handleDialogConfirm} autoFocus>
                        예
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
}

export default Review;