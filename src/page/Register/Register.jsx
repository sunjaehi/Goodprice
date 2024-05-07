import React,{ useState,useRef } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl } from "@mui/material";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import './Register.css';
import Snackbar from '@mui/material/Snackbar';
import { useForm } from 'react-hook-form';

function Register() {
    const theme=createTheme();
    const [checked, setChecked] = useState(false);

    const handleAgree = (event) => {
        setChecked(event.target.checked);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const [state,setState]=useState({
        open:false,
        vertical:'top',
        horizontal:'center'
    });
    const {vertical, horizontal,open}=state;
    
    const handleClick = (newState) => () => {
        setState({...newState, open:true});
    };
    const handleClose = () => {
        setState({...state,open:false});
    }
    
    const button = (
        <>
            <Box sx={{display:'flex',justifyContent:'center'}}>
                <Button onClick={handleClick({vertical:'top', horizontal:'center'})}>
                    중복확인
                </Button>
            </Box>
        </>
    )
    

    /*
    let elInputPassword = document.querySelector('#password');
    let elInputPasswordRetype = document.querySelector('#rePassword');
    let elMismatchMessage = document.querySelector('.mismatch-message');
    let elStrongPasswordMessge = document.querySelector('.strongPassword-message');

    const strongPassword = (str) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(str);
    }
    const isMatch = (password1,password2) => {
        return password1===password2;
    } 
    elInputPassword.onkeyup = function() {
        if (elInputPassword.value.length !== 0) {
            if (strongPassword(elInputPassword.value)) {
                elStrongPasswordMessge.classList.add('hide');
            }
            else {
                elStrongPasswordMessge.classList.remove('hide');
            }
        }
        else {
            elStrongPasswordMessge.classList.add('hide');
        }
    }
    elInputPasswordRetype.onkeyup=function() {
        if (elInputPasswordRetype.value.length !== 0) {
            if(isMatch(elInputPassword.value, elInputPasswordRetype.value)) {
                elMismatchMessage.classList.add('hide');
            }
            else {
                elMismatchMessage.classList.remove('hide');
            }
        }
        else {
            elMismatchMessage.classList.add('hide');
        }
    }
    */
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box    
                    sx={{
                        marginTop:8,
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                    }}
                >
                    <Avatar sx={{m:1, bgcolor:'secondary.main'}}>
                        <PersonAddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        회원가입
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt:3}}>
                        <FormControl component="fieldset" variant="standard">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        autoFocus
                                        fullWidth
                                        id="nickname"
                                        name="nickname"
                                        label="닉네임"
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        required
                                        autoFocus
                                        fullWidth
                                        type="email"
                                        id="email"
                                        name="email"
                                        label="이메일 주소"
                                        
                                    />
                                </Grid>
                                <Grid item xs={4} sx={{mt:1}}>
                                    {button}
                                    <Snackbar
                                        anchorOrigin={{vertical, horizontal}}
                                        open={open}
                                        onClose={handleClose}
                                        message="사용 가능한 이메일입니다."
                                        key={vertical+horizontal}
                                    />
                                                                        
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="password"
                                        id="password"
                                        name="password"
                                        label="비밀번호 (숫자+영문자+특수문자 8자리 이상)"
                                        
                                    />
                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="password"
                                        id="password"
                                        name="rePassword"
                                        label="비밀번호 확인"
                                        
                                    />
                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox onChange={handleAgree} color="primary" />}
                                        label="회원가입에 동의합니다."
                                    />
                                </Grid>
                            </Grid>
                            <Button 
                                type="submit"
                                fullWidth
                                color="secondary"
                                variant="contained"
                                sx={{mt:3, mb:2}}
                                size="large"
                                
                            >
                                회원가입
                            </Button>
                        </FormControl>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default Register;