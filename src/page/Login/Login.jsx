import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";


const defaultTheme = createTheme();

function Login(props) {
    const navigate=useNavigate();
    const API = "http://localhost:8080/api/v1/login";
    const [userEmail, setUseremail] = useState('');
    const [userPw, setUserpw] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(API, {
            method: "POST",
            headers: {
                'Content-Type':'application/json; charset=utf-8;'
            },
            body: JSON.stringify({
                email:email,
                password:password
            }),
        }) //만약 method:'POST'로 요청하는 경우, headers에 필수로 담아야 함
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.token) {navigate("/")}
                else {
                    alert("ID 혹은 비밀번호를 확인해주세요")
                }
            });
    };
    /*
    checkToken = () => {
        const token = localStorage.getItem("token");
        alert(token);
    }
    */
    return (
        <ThemeProvider theme={defaultTheme}>
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
                        <LoginIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            //onChange={(e)=>setUseremail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            //onChange={(e)=>setUserpw(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="아이디/비밀번호 저장"
                        />
                        <Button 
                            type="submit"
                            fullWidth
                            color="secondary"
                            variant="contained"
                            sx={{mt:3,mb:2}}
                            //disabled={this.state.ID.includes('@') && PW.length>=5 ? false : true}
                            onClick={handleSubmit}
                        >
                            로그인
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/Findpassword" variant="body2">
                                    비밀번호 찾기
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/Register" variant="body2">
                                    아직 회원이 아니신가요? 회원가입
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default Login;