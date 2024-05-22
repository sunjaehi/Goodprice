import React, { useState, useEffect } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function Shopmanage() {
    const navigate = useNavigate('');
    const [item, setItem] = useState(null);

    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
    }
    const shopSubmit = (e) => {
        e.preventDefault();
    }
    const [value, setValue] = useState(dayjs('2024-05-22T09:00'));
    return (
        <form onSubmit={shopSubmit}>
            <Box sx={{
            display:"flex",
            flexDirection:"row"
            }}
            >
            <Adminlist />
            <hr />
            <Stack
                component="form"
                spacing={3}
                autoComplete="off"
                width="70%"
                justifyContent="center"
                margin={5}
                ml={10}
            >
                <TextField
                    disabled
                    id="disabled"
                    placeholder="상호명"
                    variant="outlined"
                />
                <TextField
                    id="shopPhone"
                    label="연락처"
                    multiline
                    variant="outlined"
                />
                <TextField
                    id="reason"
                    label="자랑거리"
                    multiline
                    variant="outlined"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['TimePicker', 'TimePicker']}>
                        <TimePicker
                            label="시작시간"
                            defaultValue={dayjs('2024-05-22T 09:00')}
                            sx={{width:"50%"}}
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
                    id="info"
                    label="기타정보"
                    multiline
                    variant="outlined"
                />
                {/* <List
                    sx={{width:'70%', bgcolor:'background.paper', flexDirection:'row'}}
                    component="nav"
                    subheader={
                        <ListSubheader component="div">
                            상품 목록
                        </ListSubheader>
                    }
                > */}
                <Typography variant="h7">상품 목록</Typography>
                <Stack direction="row" spacing={3}>
                    <Card sx={{width:"50%"}}>
                        <CardMedia
                            sx={{height:60}}
                            image="./KakaoTalk_20230512_215541287.jpg"
                            title="item"
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                상품1
                            </Typography>
                            <TextField id="price" label="가격 수정" variant="outlined" sx={{mt:"5px"}} fullWidth/>
                        </CardContent>
                        <CardActions>
                            <Button size="small">삭제</Button>
                            <Button size="small">수정</Button>
                        </CardActions>
                    </Card>
                    <Card sx={{width:"50%", mt:"5px"}}>
                        <CardMedia
                            component="img"
                            sx={{height:60}}
                            title="item"
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                상품1
                            </Typography>
                            <TextField id="price" label="가격 수정" variant="outlined" sx={{mt:"5px"}} fullWidth/>
                        </CardContent>
                        <CardActions>
                            <Button size="small">삭제</Button>
                            <Button size="small">수정</Button>
                        </CardActions>
                    </Card>
                    <Card sx={{width:"50%", mt:"5px"}}>
                        <CardMedia
                            component="img"
                            sx={{height:60}}
                            title="item"
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                상품1
                            </Typography>
                            <TextField id="price" label="가격 수정" variant="outlined" sx={{mt:"5px"}} fullWidth/>
                        </CardContent>
                        <CardActions>
                            <Button size="small">삭제</Button>
                            <Button size="small">수정</Button>
                        </CardActions>
                    </Card>
                </Stack>
                {/* </List> */}
                <Stack    
                    direction="row-reverse"
                    gap={3}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{
                            mr:'10px',
                            borderRadius:"15px",
                            backgroundColor:"black",
                            ":hover" :{backgroundColor:"grey"}
                        }}
                    >수정</Button>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius:"15px",
                            backgroundColor:"lightgrey",
                            color:"black",
                            ":hover":{backgroundColor:"grey"}
                        }}
                        onClick={navigateToMainadmin}
                    >취소</Button>
                </Stack>
            </Stack>
        </Box>
    </form>
        

    );
}