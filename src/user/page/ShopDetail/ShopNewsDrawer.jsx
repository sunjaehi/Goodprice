import React, { useEffect, useRef } from 'react';
import { SwipeableDrawer, Box, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel';

const drawerBleeding = 56;

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

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

const ShopNewsDrawer = ({ open, onClose, onOpen, shopNewsDatas, fetchMoreData }) => {
    const observerRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMoreData();
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
    }, [observerRef.current, fetchMoreData]);

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={false}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                sx: {
                    height: `calc(80% - ${drawerBleeding}px)`,
                    overflow: 'visible',
                },
            }}
        >
            <StyledBox
                sx={{
                    position: 'absolute',
                    top: -drawerBleeding,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    visibility: 'visible',
                    right: 0,
                    left: 0,
                }}
            >
                <Typography sx={{ p: 2, color: 'text.secondary' }}>가게 소식</Typography>
            </StyledBox>
            <StyledBox
                sx={{
                    px: 2,
                    pb: 2,
                    height: '100%',
                    overflow: 'auto',
                }}
            >
                {shopNewsDatas.map((news, index) => (
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
                <div ref={observerRef} />
            </StyledBox>
        </SwipeableDrawer>
    );
};

export default ShopNewsDrawer;