import React, { useState, useEffect, useCallback } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button, Typography, Card, CardContent, Divider, Autocomplete, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from 'lodash';

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function MemberAdminDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [fcmToken, setFcmToken] = useState('');
    const [shopKeyword, setShopKeyword] = useState('');
    const [shopOptions, setShopOptions] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [shopManagerList, setShopManagerList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedShopManagerId, setSelectedShopManagerId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let result = await fetch(`${backend}/api/v1/member/info?memberId=${id}`);
            if (result.status === 404) {
                alert('존재하지 않는 회원입니다');
                navigate(-1);
                return;
            }
            let json = await result.json();
            setMemberInfo(json);
            setFcmToken(json.fcmToken || '');
        }
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        fetchShopManagerList();
    }, [id]);

    const fetchShopManagerList = async () => {
        let result = await fetch(`${backend}/api/v1/shop-manager/list?memberId=${id}`);
        if (result.status === 200) {
            let json = await result.json();
            setShopManagerList(json);
        }
    };

    const handleFcmTokenChange = (event) => {
        setFcmToken(event.target.value);
    };

    const updateFcmToken = () => {
        fetch(`${backend}/api/v1/member/update-fcm-by-admin`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ memberId: id, fcmToken: fcmToken })
        })
            .then(response => {
                if (response.status === 200) {
                    alert('FCM 토큰 업데이트 완료');
                } else {
                    alert('FCM 토큰 업데이트 실패');
                }
            });
    };

    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
    };

    const fetchShopNames = async (keyword) => {
        const page = 0;
        let result = await fetch(`${backend}/api/v1/shop/search?keyword=${keyword}&page=${page}`);
        if (result.status === 200) {
            let json = await result.json();
            setShopOptions(json.shops || []);
        }
    };

    const debouncedFetchShopNames = useCallback(debounce(fetchShopNames, 1000), []);

    const handleShopInputChange = (event, value) => {
        setShopKeyword(value);
        if (value) {
            debouncedFetchShopNames(value);
        } else {
            setShopOptions([]);
        }
    };

    const handleShopSelect = (event, value) => {
        setSelectedShop(value);
    };

    const handleAddButtonClick = async () => {
        if (selectedShop) {
            const shopManagerRequest = {
                shopId: selectedShop.id,
                memberId: id
            };

            const response = await fetch(`${backend}/api/v1/shop-manager`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shopManagerRequest)
            });

            if (response.status === 201) {
                alert(`추가 완료`);
                fetchShopManagerList();
            } else {
                alert('가게 추가 실패');
            }
        } else {
            alert('가게를 선택해주세요.');
        }
    };

    const handleOpenDialog = (shopManagerId) => {
        setSelectedShopManagerId(shopManagerId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedShopManagerId(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedShopManagerId) {
            const response = await fetch(`${backend}/api/v1/shop-manager/${selectedShopManagerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const result = await response.json();
                if (result) {
                    setShopManagerList((prevList) => prevList.filter((shop) => shop.id !== selectedShopManagerId));
                    alert(`삭제 완료`);
                } else {
                    alert(`삭제 실패`);
                }
            } else {
                alert(`삭제 실패`);
            }
            handleCloseDialog();
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", p: 3 }}>
            <Adminlist />
            <Divider orientation="vertical" flexItem />
            {memberInfo && (
                <Card sx={{ flex: 1, ml: 3, p: 3 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>회원 상세 정보</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <Typography variant="body1"><strong>회원 PK ID:</strong> {memberInfo.id}</Typography>
                            <Typography variant="body1"><strong>이메일:</strong> {memberInfo.email}</Typography>
                            <Typography variant="body1"><strong>닉네임:</strong> {memberInfo.nickname}</Typography>
                            <Typography variant="body1"><strong>권한:</strong> {memberInfo.role}</Typography>
                            <Typography variant="body1"><strong>가입일:</strong> {memberInfo.joinedAt}</Typography>
                            <Typography variant="body1"><strong>최종 개인정보 수정일:</strong> {memberInfo.updatedAt}</Typography>
                            <Typography variant="body1"><strong>활성화 여부:</strong> {memberInfo.isAvailable ? '예' : '아니오'}</Typography>
                            <Typography variant="body1"><strong>이메일 알림 사용 여부:</strong> {memberInfo.emailFlag ? '예' : '아니오'}</Typography>
                            <Typography variant="body1"><strong>FCM 알림 사용 여부:</strong> {memberInfo.fcmFlag ? '예' : '아니오'}</Typography>
                            <TextField
                                label="FCM 토큰"
                                variant="outlined"
                                value={fcmToken}
                                onChange={handleFcmTokenChange}
                                fullWidth
                            />
                            <Typography variant="h6" gutterBottom>담당 가게 추가</Typography>
                            <Stack direction="row" spacing={2}>
                                <Autocomplete
                                    options={shopOptions}
                                    getOptionLabel={(option) => option.name}
                                    onInputChange={handleShopInputChange}
                                    onChange={handleShopSelect}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            {option.name} ({option.address})
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="가게 이름 검색"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    sx={{ flex: 1 }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: "15px",
                                        backgroundColor: "black",
                                        ":hover": { backgroundColor: "grey" }
                                    }}
                                    onClick={handleAddButtonClick}
                                >
                                    추가
                                </Button>
                            </Stack>
                            <Typography variant="h6" gutterBottom>담당 가게 목록</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {shopManagerList.map((shop) => (
                                    <Chip
                                        key={shop.id}
                                        label={
                                            <Box sx={{ whiteSpace: 'normal', textAlign: 'center' }}>
                                                <Typography variant="body2">{shop.shopName}</Typography>
                                                <Typography variant="caption" color="textSecondary">{shop.shopAddress}</Typography>
                                            </Box>
                                        }
                                        variant="outlined"
                                        onDelete={() => handleOpenDialog(shop.id)}
                                        sx={{ height: 'auto' }}
                                    />
                                ))}
                            </Box>
                        </Stack>
                        <Stack direction="row-reverse" gap={2} mt={3}>
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={updateFcmToken}
                            >
                                FCM 토큰 업데이트
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "lightgrey",
                                    color: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={navigateToMainadmin}
                            >
                                취소
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">삭제 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        이 가게의 관리 권한을 삭제하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        아니오
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        예
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
