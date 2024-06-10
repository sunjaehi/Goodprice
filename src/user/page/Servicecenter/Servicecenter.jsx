import React, { useState, useEffect, useRef } from "react";
import { Box, MenuItem, Select, Stack } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import CssBaseline from "@mui/material/CssBaseline";
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import { useDaumPostcodePopup } from "react-daum-postcode";
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";

const backend = process.env.REACT_APP_BACKEND_ADDR;

function Servicecenter() {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/Login");
    }
    const [inputItem, setInputItems] = useState({
        shopName: '',
        shopAddress: '',
        shopPhone: '',
        info: '',
        reason: '',
        sectorId: '',
        zipcode: ''
    });

    const [sectors, setSectors] = useState(null);

    const [sector, setSector] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        const atk = sessionStorage.getItem('atk')
        if (atk === null) {
            alert('로그인이 필요합니다!');
            navigateToLogin();
        }
        fetch(`${backend}/api/v1/sector/`)
            .then(result => result.json())
            .then(json => setSectors(json));
    }, []);

    useEffect(() => checkValidation(), [startTime]);
    useEffect(() => checkValidation(), [endTime]);

    const open = useDaumPostcodePopup(postcodeScriptUrl);
    const handleComplete = (data) => {
        if (data.addressType === 'R') {
            setInputItems((prev) => ({
                ...prev,
                shopAddress: data.roadAddress,
                zipcode: data.zonecode
            }));
        }
        checkValidation();
    };

    const checkValidation = () => {
        setIsFormValid(
            Object.values(inputItem).every(value => value.trim() !== '')
            && startTime !== null
            && endTime !== null
        );
    }

    const handleInput = (e) => {
        const { id, value } = e.target;
        setInputItems((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        checkValidation();
    };

    const handleSearch = () => {
        open({ onComplete: handleComplete });
    }

    const formatTime = (time) => {
        return time.format('HH:mm');
    };

    function submit(e) {
        e.preventDefault();
        console.log(inputItem);
        const businessHours = `${formatTime(startTime)} - ${formatTime(endTime)}`;
        const bodyString = JSON.stringify({
            ...inputItem,
            businessHours: businessHours
        });
        fetch(`http://localhost:8080/api/v1/proposal/register`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("atk"),
                'Content-Type': 'application/json; charset=utf-8;'
            },
            body: bodyString,
        }).then(response => {
            if (response.status === 201) {
                alert("등록 성공");
                navigate('/');
            }
            else alert("등록 실패");
        })
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                fullWidth
                gap={1}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Avatar sx={{ m: 1, bgcolor: '#435585' }}>
                        <AddBusinessOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        새로운 가게 등록 요청
                    </Typography>
                </Box>

                <TextField
                    margin="normal"
                    fullWidth
                    id="shopName"
                    label="상호명"
                    value={inputItem.shopName}
                    onChange={handleInput}
                />
                <FormControl>
                    <InputLabel id="select-label">업종 선택</InputLabel>
                    <Select
                        labelId="sector-label"
                        id="sectorId"
                        value={sector}
                        label="업종 선택"
                        onChange={(e) => { setSector(e.target.value); setInputItems(prev => ({ ...prev, sectorId: e.target.value })) }}
                        fullWidth
                    >
                        {sectors && sectors.map((sector) => (
                            <MenuItem
                                value={`${sector.id}`}
                            >{`${sector.name}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start"
                    }}
                    gap={2}
                    fullWidth
                >

                    <TextField
                        id="postcode"
                        placeholder="우편번호"
                        multiline
                        inputProps={{ readOnly: true, disableUnderline: true }}
                        value={inputItem.zipcode}
                        sx={{
                            width: "50%",
                        }}
                        onChange={handleInput}
                    />
                    <Button
                        onClick={handleSearch}
                        variant="contained"
                        sx={{
                            width: "50%", borderRadius: "10px",
                            color: "white",
                            bgcolor: "#435585",
                            ":hover": {
                                bgcolor: "#435585"
                            }
                        }}
                    >우편번호 찾기</Button>
                </Box>
                <TextField
                    id="detailAddress"
                    placeholder="가게 주소"
                    inputProps={{ readOnly: true, disableUnderline: true }}
                    multiline
                    value={inputItem.shopAddress}
                    fullWidth
                    onChange={handleInput}
                />
                <TextField
                    id="shopPhone"
                    label="연락처"
                    multiline
                    fullWidth
                    value={inputItem.shopPhone}
                    onChange={handleInput}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack fullWidth gap={1}>
                        <TimePicker
                            label="시작시간"
                            defaultValue={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                        />
                        <TimePicker
                            label="종료시간"
                            defaultValue={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                            fullWidth
                        />
                    </Stack>
                </LocalizationProvider>
                <TextField
                    id="reason"
                    label="이유"
                    multiline
                    rows={3}
                    fullWidth
                    value={inputItem.reason}
                    onChange={handleInput}
                />
                <TextField
                    id="info"
                    label="기타정보"
                    multiline
                    value={inputItem.info}
                    onChange={handleInput}
                    fullWidth
                />
                <Box
                    flexDirection="row-reverse"
                    gap={2}
                    display="flex"
                >
                    <Button variant="contained" color="secondary"
                        sx={{ mr: '5px', bgcolor: '#435585' }}
                        onClick={submit}
                        disabled={!isFormValid}
                    >등록</Button>
                    <Button variant="outlined" sx={{ borderColor: 'black', color: 'black' }}>취소</Button>
                </Box>
            </Box>
        </Container >
    );
}
export default Servicecenter;