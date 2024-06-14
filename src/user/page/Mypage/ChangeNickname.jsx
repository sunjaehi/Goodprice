import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
    typography: {
        h1: {
            fontSize: 30,
        }
    }
});

const backend = process.env.REACT_APP_BACKEND_ADDR;

function ChangeNickname() {
    const [nickname, setNickname] = useState("");
    const [isNicknameVerified, setNicknameVerified] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isNicknameVerified) {
            fetch(`${backend}/api/v1/member/change-nickname`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem('atk')
                },
                body: JSON.stringify({ nickname: nickname })
            })
                .then(response => {
                    if (response.status === 200) {
                        alert('닉네임이 정상적으로 변경되었습니다');
                        navigate('/mypage');
                    } else {
                        alert('닉네임 변경에 실패하였습니다. 잠시 후 다시 시도해주세요');
                    }
                })
        }
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setNicknameVerified(false);
    };

    const navigateToHome = () => {
        navigate("/");
    };

    function checkNickname() {
        fetch(`${backend}/api/v1/member/check-nickname?nickname=${nickname}`)
            .then(response => response.json())
            .then(json => {
                if (!json) {
                    alert('사용 가능한 닉네임입니다');
                    setNicknameVerified(true);
                } else {
                    alert('사용 불가능한 닉네임입니다');
                    setNicknameVerified(false);
                }
            });
    };

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
                    <Typography variant="h1">
                        닉네임 변경
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            required
                            fullWidth
                            label="새 닉네임"
                            autoFocus
                            value={nickname}
                            onChange={handleNicknameChange}
                        />
                        <Button
                            color="secondary"
                            variant="contained"
                            fullWidth
                            onClick={checkNickname}
                            sx={{ mt: 2, backgroundColor: '#2a75f3',
                                ":hover": {
                                    backgroundColor: '#4285f4'
                                } }}
                        >
                            닉네임 중복 확인
                        </Button>
                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isNicknameVerified}
                                sx={{
                                    mr: 2, width: '50%', backgroundColor: isNicknameVerified ? '#435585' : 'grey', color: 'white',
                                    ":hover": {
                                        backgroundColor: isNicknameVerified ? '#435585' : 'grey'
                                    }
                                }}
                            >
                                변경 완료
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{ ml: 2, width: '50%', color: 'black', borderColor: 'black' }}
                                onClick={navigateToHome}
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default ChangeNickname;