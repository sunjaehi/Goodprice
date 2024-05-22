import React, { useState, useRef } from "react";
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
    const theme = createTheme();
    const [isAvailable, setIsAvailable] = useState(false);
    const [isAvailableEmail, setIsAvailableEmail] = useState(false);
    const [isAvailableNickname, setIsAvailableNickname] = useState(false);
    const [isAvailabePassword, setIsAvailablePassword] = useState(false);
    const [isAvailableConfirm, setIsAvailableConfirm] = useState(false);

    const [checked, setChecked] = useState(false);
    const emailInput = useRef();
    const passwordInput = useRef();
    const passwordConfirmInput = useRef();
    const nicknameInput = useRef();
    const handleAgree = (event) => {
        setChecked(event.target.checked);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center'
    });
    const { vertical, horizontal, open } = state;


    function onEmailFormChange() {
        setIsAvailableEmail(false);
    }

    function onNicknameFormChange() {
        setIsAvailableNickname(false);
    }

    function onPasswordFormChange() {
        const confirm = passwordConfirmInput.current.value;
        const input = passwordInput.current.value;
        setIsAvailablePassword(false);
        setIsAvailableConfirm(input === confirm);

        const reg = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,}$/;
        setIsAvailablePassword(input.match(reg) !== null)
    }

    function onPasswordConfirmFormChange() {
        setIsAvailableConfirm(false);
        const input = passwordInput.current.value;
        const confirm = passwordConfirmInput.current.value;
        setIsAvailable(confirm === input);
    }

    const handleClick = (newState) => () => {
        const email = emailInput.current.value
        fetch(`http://localhost:8080/api/v1/member/check?email=${email}`)
            .then(response => response.json())
            .then(json => {
                if (json === true) setIsAvailableEmail(false);
                else setIsAvailableEmail(true);
            });
        setState({ ...newState, open: true });
    };
    const handleClose = () => {
        setState({ ...state, open: false });
    }

    const button = (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleClick({ vertical: 'top', horizontal: 'center' })}>
                    중복확인
                </Button>
            </Box>
        </>
    )
    return (
        <ThemeProvider theme={theme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonAddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        회원가입
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <FormControl component="fieldset" variant="standard">
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <TextField
                                        required
                                        autoFocus
                                        fullWidth
                                        type="email"
                                        id="email"
                                        inputRef={emailInput}
                                        name="email"
                                        onChange={onEmailFormChange}
                                        label="이메일 주소"
                                    />
                                </Grid>
                                <Grid item xs={4} sx={{ mt: 1 }}>
                                    {button}
                                    <Snackbar
                                        anchorOrigin={{ vertical, horizontal }}
                                        open={open}
                                        onClose={handleClose}
                                        message={isAvailableEmail ? "사용가능한 이메일입니다" : "이미 가입 이력이 있는 이메일입니다"}
                                        key={vertical + horizontal}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="nickname"
                                        name="nickname"
                                        label="닉네임"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="password"
                                        id="password"
                                        name="password"
                                        label="비밀번호"
                                        placeholder="숫자+영문자+특수문자 8자리 이상"
                                        inputRef={passwordInput}
                                        onChange={onPasswordFormChange}
                                    />
                                    {!isAvailabePassword && <Alert severity="warning">숫자,영문자, 특수문자 중 하나 이상을 포함하여 8자리 이상 입력하세요</Alert>}
                                    {isAvailabePassword && <Alert severity="success">사용 가능한 비밀번호입니다.</Alert>}

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="password"
                                        id="password"
                                        name="rePassword"
                                        label="비밀번호 확인"
                                        placeholder="비밀번호를 한 번 더 입력해주세요"
                                        onChange={onPasswordConfirmFormChange}
                                        inputRef={passwordConfirmInput}
                                    />
                                    {!isAvailableConfirm && <Alert severity="warning">비밀번호가 일치하지 않습니다.</Alert>}
                                    {isAvailableConfirm && <Alert severity="success">V</Alert>}

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
                                sx={{ mt: 3, mb: 2 }}
                                size="large"
                                disabled={!(isAvailableEmail && isAvailabePassword && isAvailableConfirm)}
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