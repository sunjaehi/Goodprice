import React, { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from "@mui/material/CssBaseline";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme,IconButton,OutlinedInput,ThemeProvider } from "@mui/material";
import Quitdialog from "../../component/Dialog/Quitdialog";
//import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();
function Myprofile() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        /*
        console.log({
            newpassword:data.get('newpassword'),
            newrepassword:data.get('newrepassword'),
            newnickname:data.get('newnickname')
        });
        */
    }
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };
    const theme = createTheme({
        typography :{
            h1 : {
                fontSize:30,
            }
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box    
                    sx={{
                        marginTop:8,
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center'

                    }}
                >
                    <Avatar sx={{mb:1, bgColor:'secondary.main'}}>
                        <SettingsIcon />
                    </Avatar>
                    <Typography variant="h1">
                        개인정보 수정
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:1}}>
                        <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">새로운 비밀번호</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                    </FormControl>
                    <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">새로운 비밀번호 확인</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <TextField
                        margin="normal"
                        required
                        sx={{width:'50%',alignContent:'center'}}
                        id="newnickname"
                        label="닉네임 변경"
                        name="newnickname"
                        autoComplete="newnickname"
                        autoFocus
                    />
                    <Button 
                        type="submit"
                        color="inherit"
                        variant="contained"
                        sx={{mt:3, mb:2,ml:5}}
                    >닉네임 중복 확인</Button>
                    <Quitdialog />
                    <Box sx={{display:'flex',
                        flexDirection:'row'}}>
                    <Button
                        type="submit"
                        color="inherit"
                        variant="contained"
                        sx={{mt:3,mr:2,width:'50%'}}
                    >수정 완료</Button>
                    <Button
                        type="submit"
                        color="inherit"
                        variant="contained"
                        sx={{mt:3,ml:2,width:'50%'}}
                    >취소</Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
    );

}
export default Myprofile;