import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Select, MenuItem, Tabs, Tab, Box, List, ListItem, ListItemText, Typography, Divider, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const backend = process.env.REACT_APP_BACKEND_ADDR;

function ShopList() {
    const [region, setRegion] = useState('');
    const [sector, setSector] = useState(0);
    const [shops, setShops] = useState([]);
    const [regions, setRegions] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${backend}/api/v1/region/`)
            .then(response => response.json())
            .then(json => setRegions(json));

        fetch(`${backend}/api/v1/sector/`)
            .then(response => response.json())
            .then(json => setSectors(json));
    }, []);

    useEffect(() => {
        setShops([]);
        setPage(0);
        setHasMore(true);
    }, [region, sector]);

    useEffect(() => {
        if (hasMore)
            loadShops(region, sector, page);
    }, [page]);

    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };

    const handleSectorChange = (event, newValue) => {
        setSector(newValue);
    };

    const loadShops = (region, sector, page) => {
        const regionParam = region === '' ? null : region;
        const sectorParam = sector == '0' ? null : sector;
        fetch(`${backend}/api/v1/shop/list?region=${regionParam}&sector=${sectorParam}&page=${page}`)
            .then(response => response.json())
            .then(json => {
                setShops(prevShops => [...prevShops, ...json.shops]);
                setHasMore(json.shops.length > 0);
            });
    };

    const lastShopElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    const getSectorName = (sectorId) => {
        const sector = sectors.find(s => s.id === sectorId);
        return sector ? sector.name : '';
    };

    const handleShopClick = (shopId) => {
        navigate(`/detail/${shopId}`);
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mb={4} px={2}>
                <Select
                    value={region}
                    onChange={handleRegionChange}
                    displayEmpty
                    style={{ marginBottom: '16px', width: '100%' }}
                >
                    <MenuItem value="">
                        전체
                    </MenuItem>
                    {regions.map((region, index) => (
                        <MenuItem key={index} value={region.id}>
                            {region.name}
                        </MenuItem>
                    ))}
                </Select>
                <Tabs
                    value={sector}
                    onChange={handleSectorChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    style={{ width: '100%' }}
                >
                    <Tab label="전체" />
                    {sectors.map((sector, index) => (
                        <Tab key={index} label={sector.name} value={sector.id} />
                    ))}
                </Tabs>
            </Box>
            {shops.length === 0 && !hasMore ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <Typography variant="h6" color="textSecondary">
                        해당하는 가게가 없습니다
                    </Typography>
                </Box>
            ) : (
                <List>
                    {shops.map((shop, index) => (
                        <React.Fragment key={index}>
                            <Paper elevation={3} style={{ margin: '8px 0', padding: '16px' }}>
                                <ListItem alignItems="flex-start" button onClick={() => handleShopClick(shop.id)}>
                                    <ListItemText
                                        primary={
                                            <>
                                                <Typography variant="h6" component="div">
                                                    {shop.name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {getSectorName(shop.sectorId)}
                                                </Typography>
                                            </>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="textPrimary"
                                                >
                                                    주소: {shop.address}
                                                </Typography>
                                                <br />
                                                {shop.phone && (
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textPrimary"
                                                    >
                                                        연락처: {shop.phone.trim()}
                                                    </Typography>
                                                )}
                                                <br />
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="textPrimary"
                                                >
                                                    추천수: {shop.recommend}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                            {index < shops.length - 1 && <Divider />} {/* 마지막 항목 뒤에는 Divider를 추가하지 않음 */}
                        </React.Fragment>
                    ))}
                    <div ref={lastShopElementRef}></div>
                </List>
            )}
        </Container>
    );
}

export default ShopList;