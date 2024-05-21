import React,{useState} from "react";
import { TextField,Box, MenuItem } from "@mui/material";
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
import { sectorSample } from "../../data/sectorSample";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import { sizing } from '@mui/system';
import Adminlist from "../section/Adminlist";
import { useNavigate } from "react-router-dom";
import DaumPostcode, { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


function Registershop() {
    const [sector, setSector] = useState('');
    const handleChange = (e) => {
        setSector(e.target.value);
    }
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const open = useDaumPostcodePopup(postcodeScriptUrl);
    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; //추가될 주소
        let localAddress = data.sido + ' ' + data.sigungu; //지역주소(시, 도 + 시, 군, 구)
        if (data.addressType === 'R') { //주소타입이 도로명주소일 경우
            if (data.bname !== '') {
                extraAddress += data.bname; //법정동, 법정리
            }
        if (data.buildingName !== '') { //건물명
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        //지역주소 제외 전체주소 치환
        fullAddress = fullAddress.replace(localAddress, '');
        //조건 판단 완료 후 지역 주소 및 상세주소 state 수정
        data.setAddressObj({
            areaAddress: localAddress,
            townAddress: fullAddress += (extraAddress !== '' ? `(${extraAddress})` : '')
        });
        //주소 검색이 완료된 후 결과를 매개변수로 전달
        //다음에 수행할 작업을 명시
        }
    }
    const handleSearch = () => {
        open({onComplete:handleComplete});
        
    }



    const [value, setValue] = useState(dayjs('2024-05-20T09:00'));

    return (
        <Box
            sx={{
                flexDirection:"row",
                display:"flex"
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
            />
            <Box
                sx={{
                    display:"flex",
                    minWidth:"100",
                    flexDirection:"row",
                    gap:3
                }}
            >
                <TextField
                    id="shopname"
                    label="상호명"
                    multiline
                    //maxrows
                    variant="standard"
                    sx={{width:'50%'}}
                />
                {/* <InputLabel id="sector">업종별</InputLabel> */}
                <FormControl sx={{width:'50%'}}>
                <InputLabel id="select-label">업종 분류</InputLabel>
                <Select 
                    labelId="sector-label"
                    id="sector"
                    value={sector}
                    label="업종별"
                    onChange={handleChange}
                >
                    {sectorSample.map((sector)=>(
                        <MenuItem
                            value={`${sector.id}`}
                        >{`${sector.name}`}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Box>
            <Box
                sx={{
                    display:"flex",
                    minWidth:"100",
                    flexDirection:"row",
                }}
                gap={3}
            >
                <TextField
                    id="postcode"
                    label="우편번호"
                    multiline
                    //maxrows
                    variant="standard"
            />
                <Button
                    onClick={handleSearch}
                    variant="outlined"
                    color="secondary"
                >주소 찾기</Button>
                               
                
            </Box>
            {/* <TextField
                    id="detailAddress"
                    label="가게 주소"
                    multiline
                    //maxrows
                    variant="standard"
            /> */}
            {/* <DaumPostcode /> */}
            <TextField
                    id="shopPhone"
                    label="연락처"
                    multiline
                    //maxrows
                    variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker','TimePicker']}>
                    <TimePicker
                        label="시작시간"
                        defaultValue={dayjs('2024-05-20T09:00')}
                        sx={{width:'50%'}}
                    />
                    <TimePicker
                        label="종료시간"
                        value={value}
                        onChange={(newValue)=>setValue(newValue)}
                        sx={{width:'50%'}}
                    />
                </DemoContainer>
            </LocalizationProvider>
            <TextField
                    id="reason"
                    label="자랑거리"
                    multiline
                    //maxrows
                    variant="standard"
            />
            <TextField
                    id="info"
                    label="기타정보"
                    multiline
                    //maxrows
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
                        mr:'5px'
                    }}
                >등록</Button>
                <Button 
                    variant="contained"
                >초기화</Button>
                    
            </Box>
        </Stack>
        <Box 
            display="flex"
            mt={5}
        >
            사진 첨부
            
        </Box>
    
        </Box>
    );
        
}
export default Registershop;