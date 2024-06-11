import React, { useState, useEffect } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";
import Card from '@mui/material/Card';
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function ShopPendingAdminDetail() {
    const navigate = useNavigate();
    const { shopId } = useParams();
    const [shopInfo, setShopInfo] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [is24Hours, setIs24Hours] = useState(false);
    const [zipcode, setZipcode] = useState(null);
    const [address, setAddress] = useState(null);
    const [regionId, setRegionId] = useState(null)

    const open = useDaumPostcodePopup(postcodeScriptUrl);
    const handleComplete = (data) => {
        if (data.addressType === 'R') {
            console.log(data);
            setAddress(data.roadAddress);
            setZipcode(data.zonecode);
            setRegionId(data.sigunguCode);
        }
    }
    const handleSearch = () => {
        open({ onComplete: handleComplete });
    }

    useEffect(() => {
        const fetchData = async () => {
            let result = await fetch(`${backend}/api/v1/shop-pending/${shopId}`);
            if (result.status === 404) {
                alert('존재하지 않는 가게입니다');
                navigate(-1);
                return;
            }
            let json = await result.json();
            setShopInfo(json);
        }
        fetchData();
    }, [shopId, navigate])

    const handle24HoursChange = (event) => {
        setIs24Hours(event.target.checked);
    };

    const onFormChange = (e) => {
        setShopInfo({ ...shopInfo, [e.target.name]: e.target.value });
    }

    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
            }}>
                <Adminlist />
                <hr />
                {shopInfo && (
                    <Stack
                        component="form"
                        spacing={3}
                        autoComplete="off"
                        width="70%"
                        justifyContent="center"
                        margin={5}
                        ml={10}
                    >
                        <h2>등록 보류된 가게 정보 수정</h2>

                        <TextField
                            disabled
                            label="상호명"
                            value={shopInfo.name}
                            variant="outlined"
                        />
                        <TextField
                            name="phone"
                            label="연락처"
                            multiline
                            variant="outlined"
                            value={shopInfo.phone}
                            onChange={onFormChange}
                        />
                        <TextField
                            id="previousAddress"
                            label="기존 가게 주소"
                            placeholder="기존 가게 주소"
                            inputProps={{ readOnly: true, disableUnderline: true }}
                            multiline
                            value={shopInfo.address}
                            variant="standard"
                        />
                        <Box
                            sx={{
                                display: "flex",
                                minWidth: "100",
                                flexDirection: "row",
                            }}
                            gap={3}
                        >
                            <TextField
                                id="postcode"
                                placeholder="우편번호"
                                multiline
                                inputProps={{ readOnly: true, disableUnderline: true }}
                                value={zipcode}
                                variant="standard"
                                sx={{ width: "80%" }}
                            />
                            <Button
                                onClick={handleSearch}
                                variant="contained"
                                sx={{
                                    bgcolor: 'black',
                                    color: 'white',
                                    ":hover": {
                                        bgcolor: "gray"
                                    }
                                }}
                            >주소 찾기</Button>

                        </Box>
                        <TextField
                            id="detailAddress"
                            placeholder="변경된 가게 주소"
                            inputProps={{ readOnly: true, disableUnderline: true }}
                            multiline
                            value={address}
                            //maxrows
                            variant="standard"
                        />
                        <TextField
                            name="boast"
                            label="자랑거리"
                            multiline
                            variant="outlined"
                            value={shopInfo.boast}
                            onChange={onFormChange}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker', 'TimePicker']}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TimePicker
                                        label="시작시간"
                                        value={startTime}
                                        onChange={newValue => setStartTime(newValue)}
                                        sx={{ width: "50%" }}
                                        disabled={is24Hours}
                                    />
                                    <TimePicker
                                        label="종료시간"
                                        value={endTime}
                                        onChange={newValue => setEndTime(newValue)}
                                        sx={{ width: '50%' }}
                                        disabled={is24Hours}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={is24Hours}
                                                onChange={handle24HoursChange}
                                            />
                                        }
                                        label="24시간"
                                    />
                                </Stack>
                            </DemoContainer>
                        </LocalizationProvider>
                        <TextField
                            name="info"
                            label="기타정보"
                            multiline
                            variant="outlined"
                            value={shopInfo.info}
                            onChange={onFormChange}
                        />

                        <Grid container spacing={3}>
                            {shopInfo.shopImgUrls && shopInfo.shopImgUrls.map((image, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    {image && ( // 이미지 URL이 있는 경우에만 미리보기 표시
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                style={{
                                                    width: '100%'
                                                }}
                                                image={image}
                                                title="shop image"
                                            />
                                        </Card>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                        <Stack
                            direction="row-reverse"
                            gap={3}
                        >
                            <Button variant="contained" color="warning">등록 반려</Button>
                            <Button variant="contained">수정 및 등록</Button>
                        </Stack>
                    </Stack>
                )}
            </Box >
        </>
    );
}
