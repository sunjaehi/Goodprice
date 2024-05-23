import React, { useEffect, useRef, useState } from "react";
import { TextField, Box, MenuItem } from "@mui/material";
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Adminlist from "../section/Adminlist";
import { useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function Registershop() {
    const [sectors, setSectors] = useState(null);
    const [sector, setSector] = useState(null);
    const [zipcode, setZipcode] = useState(null);
    const [address, setAddress] = useState(null);
    const [regionId, setRegionId] = useState(null);

    const [startTime, setStartTime] = useState(dayjs('2024-05-20T09:00'));
    const [endTime, setEndTime] = useState(dayjs());
    const idInput = useRef(null);
    const nameInput = useRef(null);
    const phoneInput = useRef(null);
    const boastInput = useRef(null);
    const infoInput = useRef(null);
    const imageInput = useRef(null);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleChange = (e) => {
        setSector(e.target.value);
    }
    const navigate = useNavigate();
    const formData = new FormData();

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/sector/')
            .then(result => result.json())
            .then(json => setSectors(json));
    }, [])
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

    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
    };

    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
    };

    const formatTime = (time) => {
        return time.format('HH:mm');
    };
    const onChangeFile = (e) => {
        let files = Array.from(e.target.files);
        setSelectedFiles(files);
        const previews = files.map(file => {
            return URL.createObjectURL(file);
        });
        setPreviews(previews);
    }
    function submit(event) {
        event.preventDefault();
        alert(sector);
        formData.append('id', idInput.current.value);
        formData.append('name', nameInput.current.value);
        formData.append('address', address);
        formData.append('sectorId', sector);
        formData.append('regionId', regionId);
        formData.append('phone', phoneInput.current.value);
        formData.append('boast', boastInput.current.value);
        formData.append('info', infoInput.current.value);
        formData.append('businessHours', `${formatTime(startTime)} - ${formatTime(endTime)}`);
        selectedFiles.forEach(file => formData.append('files',file));

        fetch(`http://localhost:8080/api/v1/shop/register`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("atk")
            },
            body: formData,
        }).then(response => {
            if (response.status === 200) {
                alert("등록 성공");
                navigate('/');
            }
            else alert("등록 실패");
        })
    }

    return (
        <Box
            sx={{
                flexDirection: "row",
                display: "flex"
            }}
        >
            <Adminlist />
            <Stack
                component="form"
                spacing={3}
                autoComplete="off"
                width="50%"
                justifyContent="center"
                margin={5}
                ml={10}
            >
                <TextField
                    id="zipcode"
                    label="가게 ID"
                    multiline
                    variant="standard"
                    inputRef={idInput}
                />
                <Box
                    sx={{
                        display: "flex",
                        minWidth: "100",
                        flexDirection: "row",
                        gap: 3
                    }}
                >
                    <TextField
                        id="shopname"
                        label="상호명"
                        multiline
                        //maxrows
                        variant="standard"
                        inputRef={nameInput}
                        sx={{ width: '50%' }}
                    />
                    {/* <InputLabel id="sector">업종별</InputLabel> */}
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel id="select-label">업종 분류</InputLabel>
                        <Select
                            labelId="sector-label"
                            id="sector"
                            value={sector}
                            label="업종별"
                            onChange={handleChange}
                        >
                            {sectors && sectors.map((sector) => (
                                <MenuItem
                                    value={`${sector.id}`}
                                >{`${sector.name}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
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
                        variant="outlined"
                        color="secondary"
                    >주소 찾기</Button>

                </Box>
                <TextField
                    id="detailAddress"
                    placeholder="가게 주소"
                    inputProps={{ readOnly: true, disableUnderline: true }}
                    multiline
                    value={address}
                    //maxrows
                    variant="standard"
                />
                {/* <DaumPostcode /> */}
                <TextField
                    id="shopPhone"
                    label="연락처"
                    multiline
                    inputRef={phoneInput}
                    variant="standard"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div>
                        <TimePicker
                            label="시작시간"
                            defaultValue={startTime}
                            onChange={handleStartTimeChange}
                            sx={{ width: '50%' }}
                        />
                        <TimePicker
                            label="종료시간"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            sx={{ width: '50%' }}
                        />
                    </div>
                    <div>
                        {`${formatTime(startTime)} - ${formatTime(endTime)}`}
                    </div>
                </LocalizationProvider>
                <TextField
                    id="reason"
                    label="자랑거리"
                    multiline
                    inputRef={boastInput}
                    variant="standard"
                />
                <TextField
                    id="info"
                    label="기타정보"
                    multiline
                    inputRef={infoInput}
                    variant="standard"
                />
                <Box
                    flexDirection="row"
                    gap={5}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        sx={{
                            mr: '5px'
                        }}
                        onClick={submit}
                    >등록
                    </Button>
                    <Button
                        variant="contained"
                    >초기화</Button>

                </Box>
            </Stack>
            <Box
                display="flex"
                mt={5}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={imageInput}
                    id="file"
                    onChange={onChangeFile}
                    style={{display:"none"}}
                />
                <Button startIcon={<AddIcon />} variant="contained"
                    sx={{
                        color:"black", backgroundColor:"lightgrey", borderRadius:"10px", mt:"10px",ml:"5px",height:"50px",
                        ":hover" : {
                            backgroundColor:"grey"
                        }
                    }}
                    onClick={()=>imageInput.current.click()}
                >사진 추가</Button>
            </Box>
            <div className="preview">
                {previews.map((preview,index)=>(
                    <img
                        key={index}
                        alt="미리보기 제공 불가"
                        src={preview}
                        style={{width:'100px', height:'100px',objectFit:'cover', margin:'10px'}}
                    />
                ))}
            </div>
        </Box>
    );

}
export default Registershop;