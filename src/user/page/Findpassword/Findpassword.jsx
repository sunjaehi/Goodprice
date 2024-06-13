import React, { useRef } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import PinIcon from '@mui/icons-material/Pin';
import { useNavigate } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const defaultTheme = createTheme();

const backend = process.env.REACT_APP_BACKEND_ADDR;

function Findpassword(props) {
    const navigate = useNavigate();
    const emailInput = useRef();
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${backend}/api/v1/member/forgot-password?email=${emailInput.current.value}`)
            .then(response => {
                if (response.status === 200) {
                    alert('비밀번호 초기화 링크를 전송하였습니다');
                    navigate('/');
                } else {
                    alert('서버 오류');
                }
            })
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#2a75f3' }}>
                        <PinIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        비밀번호 찾기
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            inputRef={emailInput}
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <Button
                            fullWidth
                            color="secondary"
                            variant="contained"
                            sx={{ mt: 3, mb: 2,
                                bgcolor:'#2a75f3',
                                color:'white',
                                ":hover" : {
                                    bgcolor:"#4285f4"
                                }
                             }}
                            onClick={handleSubmit}
                        >비밀번호 초기화 요청하기</Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );

}
export default Findpassword;