import React from 'react';
import { SwipeableDrawer, FormControl, InputLabel, Select, MenuItem, Button, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Link } from 'react-router-dom';
import { sectorSample } from '../../../data/sectorSample';

const defaultImage = '/images/default_storeImage.png';

const ShopListDrawer = ({ open, onClose, onOpen, isSmallScreen, theme, sector, handleChange, filterData, filtered }) => {
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            PaperProps={{
                sx: {
                    height: '90%',
                    maxWidth: isSmallScreen ? theme.breakpoints.values.sm : '100%',
                    margin: '0 auto',
                }
            }}
        >
            <div role="presentation" style={{ padding: '20px' }}>
                <FormControl sx={{ display: 'flex', minWidth: 300, mb: 2 }}>
                    <InputLabel id="sector-label">업종</InputLabel>
                    <Select labelId='sector-label' value={sector} label="업종" onChange={handleChange}>
                        {sectorSample.map(sector => (
                            <MenuItem key={sector.id} value={sector.id}>{sector.name}</MenuItem>
                        ))}
                    </Select>
                    <Button
                        sx={{
                            mt: "10px",
                            color: 'white',
                            bgcolor: "#2a75f3",
                            ":hover": { bgcolor: "#4285f4" }
                        }}
                        variant="outlined"
                        size="small"
                        endIcon={<SendIcon />}
                        onClick={filterData}
                    >
                        업종 선택
                    </Button>
                </FormControl>
                <List sx={{ minWidth: 360, bgcolor: 'background.paper' }}>
                    <Typography variant="body1" align="center">{filtered.length}개의 가게가 있습니다.</Typography>
                    {filtered.map((data) => (
                        <ListItem key={data.id}>
                            <ListItemButton component={Link} to={`/detail/${data.id}`}>
                                <ListItemAvatar sx={{ width: 100, height: 100, overflow: 'hidden', marginRight: 2 }}>
                                    <img
                                        src={data.imgUrl || defaultImage}
                                        alt="상점 이미지"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultImage;
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={data.name}
                                    secondary={
                                        <>
                                            <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                                {data.address}
                                            </Typography>
                                            {data.phone.length > 5 ? (
                                                <a href={`tel:${data.phone}`}>{data.phone}</a>
                                            ) : (
                                                "연락처 정보가 없습니다"
                                            )}
                                            <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                                <img src="https://img.icons8.com/fluency/48/thumb-up.png" width={25} height={25} alt="recommendation icon" />
                                                {data.recommend}
                                            </Typography>
                                            <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                                {sectorSample[(Number(data.sectorId)) - 1].name}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>
        </SwipeableDrawer>
    );
};

export default ShopListDrawer;
