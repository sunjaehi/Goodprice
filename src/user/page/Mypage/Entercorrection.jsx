import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { createTheme,ThemeProvider } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PinIcon from '@mui/icons-material/Pin';

function Entercorrection() {
    const navigate=useNavigate();

    const navigateToMyprofile = () => {
        navigate("/Myprofile");
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
            },
            subtitle1:{
                fontSize:12,
                color:'gray',
                marginTop:10
            }
        }
    })
    return (
        <Box 
            sx={{
                marginTop:8,
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
            }}
        >
            <ThemeProvider theme={theme}>
            <Avatar sx={{m:1, bgcolor:'#2a75f3'}}>
                <PinIcon />
           </Avatar> 
           <Typography variant="h1">
                비밀번호 확인
           </Typography>
           <Typography variant="subtitle1">
                본인 인증을 위해 비밀번호를 입력해주세요
           </Typography>
           <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">비밀번호 입력</InputLabel>
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
        <Button 
            variant="contained"
            type='submit'
            sx={{width:'50%',mt:5,backgroundColor:'#2a75f3',
                ":hover":{
                    backgroundColor:'#4285f4'
                }
            }}
            onClick={navigateToMyprofile}
        >비밀번호 확인</Button>
        </ThemeProvider>
           
        </Box>
        
    )

}
export default Entercorrection;