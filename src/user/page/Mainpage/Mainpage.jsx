import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container, Grid } from '@mui/material'; // Grid를 MUI에서 가져옵니다.
import Carousel from 'react-material-ui-carousel';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../component/BottomNavigation/BottomNavigation';

const backend = process.env.REACT_APP_BACKEND_ADDR;
function Mainpage() {
    const [newShopDatas, setNewShopDatas] = useState(null);
    const [sectors, setSectors] = useState(null);
    const [bestShops, setBestShops] = useState(null);
    const [dailyShops, setDailyShops] = useState(null);

    const defaultImage = '/images/default_storeImage.png';

    const navigate = useNavigate();

    const handleCardClick = (link) => {
        navigate(link);
    };
    useEffect(() => {
        fetch(`${backend}/api/v1/sector/`)
            .then(result => result.json())
            .then(json => setSectors(json));
        fetch(`${backend}/api/v1/shop/best`)
            .then(result => result.json())
            .then(json => setBestShops(json));
        fetch(`${backend}/api/v1/newShop/`)
            .then(result => result.json())
            .then(json => setNewShopDatas(json));
        fetch(`${backend}/api/v1/dailyShop/`)
            .then(result => result.json())
            .then(json => setDailyShops(json));
    }, []);


    return (
        <Container maxWidth="sm">
            <>
                {newShopDatas && (
                    <>
                        <Typography gutterBottom variant="h6" component="div">
                            착한가격 업소란?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            착한 가격, 청결한 가게운영, 기분좋은 서비스 제공으로 소비자에게 만족을 드리기 위해 정부와 지방자치단체가 선정한 우수업소가 바로 ‘착한가격업소’ 입니다.
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            새로 추가된 가게
                        </Typography>
                        <Carousel
                            autoPlay
                            animation="slide"
                            interval={5000}
                            swipe={false}
                            cycleNavigation
                            navButtonsAlwaysVisible={false}
                        >
                            {newShopDatas.map((newShopData) => (
                                <Card key={newShopData.shopId}>
                                    <CardActionArea onClick={() => handleCardClick(`/detail/${newShopData.shopId}`)}>
                                        <div style={{ width: '100%', paddingTop: '50%', position: 'relative' }}>
                                            <img
                                                src={newShopData.imgUrl}
                                                alt="상점 이미지"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null; // prevents looping
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                        </div>
                                        <CardContent>
                                            <Typography variant="h5">{newShopData.name}</Typography>
                                            <Typography variant="body1">{newShopData.address}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Carousel>
                    </>
                )}
            </>
            <Typography gutterBottom variant="h5" component="div">
                오늘의 착한 가격 업소
            </Typography>
            <Grid container spacing={2}>
                {
                    dailyShops && dailyShops.map(dailyShop => (
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(`/detail/${dailyShop.shopId}`)}>
                                    <div style={{ width: '100%', paddingTop: '50%', position: 'relative' }}>
                                        <img
                                            src={dailyShop.imgUrl}
                                            alt="상점 이미지"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null; // prevents looping
                                                e.target.src = defaultImage;
                                            }}
                                        />
                                    </div>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {dailyShop.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {dailyShop.address}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
            <Typography gutterBottom variant="h5" component="div">
                업종별 베스트 가게
            </Typography>
            <Grid container spacing={2}>
                {
                    bestShops && bestShops.map(bestShop =>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                {sectors.find(sector => sector.id === bestShop.sector).name}
                            </Typography>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(`/detail/${bestShop.shopId}`)}>
                                    <div style={{ width: '100%', paddingTop: '50%', position: 'relative' }}>
                                        <img
                                            src={bestShop.imgUrl}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null; // prevents looping
                                                e.target.src = defaultImage;
                                            }}
                                        />
                                    </div>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {bestShop.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {bestShop.address}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                }
            </Grid>
            <BottomNavigation />
        </Container >
    );
}
export default Mainpage;
