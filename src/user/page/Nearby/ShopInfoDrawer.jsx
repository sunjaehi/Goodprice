import React from 'react';
import { SwipeableDrawer, Typography } from '@mui/material';
import { sectorSample } from '../../../data/sectorSample';

const ShopInfoDrawer = ({ open, onClose, onOpen, selectedShop }) => {
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            PaperProps={{ sx: { height: '25%' } }}
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
                </div>
            )}
        </SwipeableDrawer>
    );
};

export default ShopInfoDrawer;
