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
import dayjs from "dayjs";
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";

function Servicecenter() {
    const navigate = useNavigate();

    const [sectors, setSectors] = useState(null);
    const [sector, setSector] = useState(null);
    const [address, setAddress] = useState(null);
    const [zipcode,setZipcode] = useState(null);
    const [regionId, setRegionId] = useState(null);

    const [startTime, setStartTime] = useState(dayjs('2024-05-20T09:00'));
    const [endTime, setEndTime] = useState(dayjs());
    const nameInput = useRef(null);
    const phoneInput = useRef(null);
    const boastInput = useRef(null);
    //const infoInput = useRef(null);
    const imageInput = useRef(null);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const formData = new FormData();

    useEffect(() => {
        fetch()
            .then(result => result.json())
            .then(json => setSectors(json));
    },[]);

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
        open({ onComplete: handleComplete});
    }
    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
    };
    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
    };
    const handleChange = (e) => {
        setSector(e.target.value);
    }
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
        formData.append('name',nameInput.current.value);
        formData.append('address',address);
        formData.append('phone',phoneInput.current.value);
        formData.append('boast',boastInput.current.value);
        //formData.append('info',infoInput.current.value);
        formData.append('businessHours', `${formatTime(startTime)} - ${formatTime(endTime)}`);
        selectedFiles.forEach(file => formData.append('files',file));

        fetch(`http://localhost:8080/api/v1/sector/`, {
            method : "POST",
            headers : {
                "Authorization" : "Bearer " + sessionStorage.getItem("atk")
            },
            body : formData,
        }).then(response => {
            if (response.status === 200) {
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
                    marginTop:8,
                    display:'flex',
                    flexDirection:'column',
                    //alignItems:'center',
                    
                }}
                fullWidth
                gap={1}
            >
                <Box sx={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                <Avatar sx={{m:1, bgcolor:'secondary.main'}}>
                    <AddBusinessOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    새로운 가게 등록 요청
                </Typography>
                </Box>
                
                {/* <Box component="form" noValidate sx={{mt:1,ml:5}} fullWidth> */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="shopname"
                        label="상호명"
                        //variant="standard"
                        inputRef={nameInput}
                    />
                    <FormControl>
                        <InputLabel id="select-label">업종 선택</InputLabel>
                        <Select
                            labelId="sector-label"
                            id="sector"
                            value={sector}
                            label="업종 선택"
                            onChange={handleChange}
                            fullWidth
                        >
                            {sectors && sectors.map((sector)=>(
                                <MenuItem
                                    value={`${sector.id}`}
                                >{`${sector.name}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                {/* </Box> */}
                <Box
                    sx={{
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"flex-start"
                    }}
                    gap={2}
                    fullWidth
                >
                    
                    <TextField
                        id="postcode"
                        placeholder="우편번호"
                        multiline
                        inputProps={{readOnly:true, disableUnderline:true}}
                        value={zipcode}
                        sx={{width:"50%",
                            
                        }}
                    />
                    <Button 
                        onClick={handleSearch}
                        variant="contained"
                        sx={{width:"50%",borderRadius:"10px",
                        color:"white",
                        bgcolor:"blueviolet",
                        ":hover" : {
                            bgcolor:"lavender"
                        }
                        }}
                    >우편번호 찾기</Button>
                </Box>
                <TextField
                    id="detailAddress"
                    placeholder="가게 주소"
                    inputProps={{readOnly:true, disableUnderline:true}}
                    multiline
                    value={address}
                    fullWidth
                />
                <TextField
                    id="shopPhone"
                    label="연락처"
                    multiline
                    inputRef={phoneInput}
                    fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack fullWidth gap={1}>
                        <TimePicker
                            label="시작시간"
                            defaultValue={startTime}
                            onChange={handleStartTimeChange}
                            
                
                        />
                        <TimePicker
                            label="종료시간"
                            defaultValue={endTime}
                            onChange={handleEndTimeChange}
                            //sx={{width:'50%'}}
                            fullWidth
                        />
                    </Stack>
                    <div>
                        {`${formatTime(startTime)} - ${formatTime(endTime)}`}
                    </div>
                </LocalizationProvider>
                <TextField
                    id="reason"
                    label="이유"
                    multiline
                    rows={3}
                    inputRef={boastInput}
                    fullWidth
                />
                {/* <TextField
                    id="info"
                    label="기타정보"
                    multiline
                    inputRef={infoInput}
                    fullWidth
                /> */}
                <Box
                display="flex"
                mt={1}
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
                        color:"black", backgroundColor:"lightgrey", borderRadius:"10px", mt:"10px",ml:"5px",
                        ":hover" : {
                            backgroundColor:"grey"
                        }
                    }}
                    onClick={()=>imageInput.current.click()}
                >이미지 추가</Button>
            </Box>
            <div className="preview">
                {previews.map((preview,index)=>(
                    <img
                        key={index}
                        alt="미리보기 제공 불가"
                        src={preview}
                        style={{width:'100px', height:'100px',objectFit:'cover',margin:'10px'}}
                    />
                ))}
            </div>
                <Box
                    flexDirection="row-reverse"
                    gap={2}
                    display="flex"
                >
                    <Button 
                        variant="contained"
                        color="secondary"
                        type="submit"
                        sx={{mr:'5px'}}
                        onClick={submit}
                    >등록</Button>
                    <Button
                        variant="contained"
                    >취소</Button>
                </Box>
            </Box>
            
        </Container>
        // </Box>

        
    );
}
export default Servicecenter;