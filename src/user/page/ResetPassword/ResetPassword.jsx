import React, { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from "@mui/material/CssBaseline";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, IconButton, OutlinedInput, ThemeProvider } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_ADDR;
export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { email } = useParams();
    const { uuid } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState(null);
    const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: 30,
            }
        }
    })

    function submit() {
        console.log(newPassword);
        console.log(newPasswordConfirm);
        const body = JSON.stringify(
            {
                email: email,
                uuid: uuid,
                password: newPassword
            }
        );

        fetch(`${backend}/api/v1/member/reset-password`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            }
        ).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                alert('서버 오류');
                return;
            }
        }).then(result => {
            if (result === true) {
                alert('비밀번호 변경 완료');
                navigate('/login');
            }
            else alert('비밀번호 변경 실패');
        })
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ mb: 1, bgColor: 'secondary.main' }}> <SettingsIcon /> </Avatar>
                    <Typography variant="h1"> 비밀번호 재설정 </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">새로운 비밀번호</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setNewPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
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
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="PasswordConfirm"
                            />
                        </FormControl>
                        <Button color="inherit" variant="contained" fullWidth sx={{ mt: 3, mr: 2 }} onClick={submit}>수정 완료</Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}