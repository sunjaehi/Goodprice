import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Container, Box, Typography, Card, CardContent, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../component/BottomNavigation/BottomNav';
import SearchIcon from '@mui/icons-material/Search';

const backend = process.env.REACT_APP_BACKEND_ADDR;

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [bottomNavValue, setBottomNavValue] = useState(2);
    const [showEmptyQueryMessage, setShowEmptyQueryMessage] = useState(true);

    const observer = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (query) {
            loadShops(query, page);
        }
    }, [query, page]);

    const handleSearch = () => {
        if (!query) {
            setShowEmptyQueryMessage(true);
            setResults([]);
            setHasMore(false);
            return;
        }
        setShowEmptyQueryMessage(false);
        setResults([]);
        setPage(0);
        setHasMore(true);
    };

    const loadShops = (keyword, page) => {
        fetch(`${backend}/api/v1/shop/search?keyword=${keyword}&page=${page}`)
            .then(response => response.json())
            .then(json => {
                setResults(prevResults => [...prevResults, ...json.shops]);
                setHasMore(!json.lastPage);
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

    const highlight = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={index} style={{ backgroundColor: 'yellow' }}>{part}</mark> :
                part
        );
    };

    const handleShopClick = (shopId) => {
        navigate(`/detail/${shopId}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <Container>
                <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: '75px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <Typography variant="h4" gutterBottom>
                        가게 검색
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginBottom: '20px', width: '100%' }}>
                        <TextField
                            label="가게 이름 검색"
                            variant="outlined"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            sx={{ marginRight: '8px', flexGrow: 1 }} // Adjust width as needed
                        />
                        <IconButton variant="contained" color="primary" onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
                {showEmptyQueryMessage ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <Typography variant="h6" color="textSecondary">
                            검색어를 입력해주세요
                        </Typography>
                    </Box>
                ) : results.length === 0 && !hasMore ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <Typography variant="h6" color="textSecondary">
                            해당하는 가게가 없습니다
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {results.map((result, index) => (
                            <React.Fragment key={result.id}>
                                <Card elevation={3} style={{ margin: '8px' }}>
                                    <ListItem alignItems="flex-start" button onClick={() => handleShopClick(result.id)}>
                                        <CardContent>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <Typography variant="h6" component="div">
                                                            {highlight(result.name, query)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {result.address}
                                                        </Typography>
                                                    </>
                                                }
                                                secondary={
                                                    <>
                                                        {result.phone && (
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textPrimary"
                                                            >
                                                                연락처: {result.phone.trim()}
                                                            </Typography>
                                                        )}
                                                        <br />
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="textPrimary"
                                                        >
                                                            추천수: {result.recommend}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </CardContent>
                                    </ListItem>
                                </Card>
                                {index < results.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                        <div ref={lastShopElementRef}></div>
                    </List>
                )}
            </Container>
            <BottomNav value={bottomNavValue} onChange={setBottomNavValue} />
        </>
    );
};

export default Search;
