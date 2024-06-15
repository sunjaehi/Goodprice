import React from 'react';
import { SwipeableDrawer, Typography, Button } from '@mui/material';
import { sectorSample } from '../../../data/sectorSample';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ShopInfoDrawer = ({ open, onClose, onOpen, selectedShop }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleDetailClick = () => {
        if (selectedShop) {
            navigate(`/detail/${selectedShop.id}`);
        }
    };

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            PaperProps={{
                sx: {
                    height: '25%',
                    maxWidth: theme.breakpoints.values.sm,
                    margin: '0 auto',
                },
            }}
            ModalProps={{
                slotProps: {
                    backdrop: {
                        style: { backgroundColor: 'transparent' },
                    },
                },
            }}
        >
            {selectedShop && (
                <div role="presentation" style={{ padding: '20px' }}>
                    <Typography variant="h6" component="div">
                        {selectedShop.name}
                    </Typography>
                    <Typography variant="body1" component="div">
                        {selectedShop.address}
                    </Typography>
                    {selectedShop.phone.length > 5 ? (
                        <Typography variant="body1" component="div">
                            <a href={`tel:${selectedShop.phone}`}>{selectedShop.phone}</a>
                        </Typography>
                    ) : (
                        <Typography variant="body1" component="div">
                            연락처 정보가 없습니다
                        </Typography>
                    )}
                    <Typography variant="body1" component="div">
                        추천 수: {selectedShop.recommend}
                    </Typography>
                    <Typography variant="body1" component="div">
                        업종: {sectorSample[(Number(selectedShop.sectorId)) - 1].name}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDetailClick}
                        sx={{ mt: 2 }}
                    >
                        자세히 보기
                    </Button>
                </div>
            )}
        </SwipeableDrawer>
    );
};

export default ShopInfoDrawer;
