import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, StepContent, Button, Typography, TextField,
  Box, FormControlLabel, Snackbar, Paper, Grid, Alert, Checkbox,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const backend = process.env.REACT_APP_BACKEND_ADDR;
const steps = [
  {
    label: '약관 동의',
    description: '이메일 정보 수집에 동의합니다.',
  },
  {
    label: '이메일 입력',
    description: '사용하실 이메일을 입력해주세요.',
  },
  {
    label: '닉네임 입력',
    description: '사용하실 닉네임을 입력해주세요.',
  },
  {
    label: '비밀번호 입력',
    description: '사용하실 비밀번호를 입력해주세요',
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    isAvailableEmail: false,
    checked: false,
    email: '',
    emailVerifyCode: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    currentStep: 0,
    isEmailVerified: false,
    isNicknameVerified: false,
    isPasswordValid: false,
    isPasswordMatch: false,
    snackbar: {
      open: false,
      vertical: 'bottom',
      horizontal: 'center',
      message: ''
    },
    activeStep: 0,
    timer: 0,
    isButtonDisabled: false
  });

  const { vertical, horizontal, open, message } = state.snackbar;

  useEffect(() => {
    let interval;
    if (state.timer > 0) {
      interval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timer: prevState.timer - 1
        }));
      }, 1000);
    } else {
      setState(prevState => ({
        ...prevState,
        isButtonDisabled: false
      }));
    }
    return () => clearInterval(interval);
  }, [state.timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const isNextButtonEnabled = () => {
    switch (state.currentStep) {
      case 0:
        return state.checked;
      case 1:
        return state.isEmailVerified;
      case 2:
        return state.isNicknameVerified;
      case 3:
        return state.isPasswordValid && state.isPasswordMatch;
      default:
        return true;
    }
  };

  const handleSnackbarClose = () => {
    setState(prevState => ({
      ...prevState,
      snackbar: {
        ...prevState.snackbar,
        open: false
      }
    }));
  };

  const handleNext = () => {
    setState(prevState => ({
      ...prevState,
      activeStep: prevState.activeStep + 1,
      currentStep: prevState.currentStep + 1
    }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const isValid = validatePassword(newPassword);
    setState(prevState => ({
      ...prevState,
      password: newPassword,
      isPasswordValid: isValid,
      isPasswordMatch: isValid && newPassword === prevState.passwordConfirm
    }));
  };

  const handlePasswordConfirmChange = (e) => {
    const newPasswordConfirm = e.target.value;
    setState(prevState => ({
      ...prevState,
      passwordConfirm: newPasswordConfirm,
      isPasswordMatch: prevState.isPasswordValid && prevState.password === newPasswordConfirm
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const submit = () => {
    fetch(`${backend}/api/v1/member/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: state.email,
        nickname: state.nickname,
        password: state.password
      })
    }).then(response => {
      if (response.status === 200) {
        alert('회원가입이 완료되었습니다');
        navigate('/login');
      } else {
        alert('서버 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  };

  const sendVerifyCode = (newState) => () => {
    fetch(`${backend}/api/v1/member/send-verification-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: state.email })
    })
      .then(response => response.json())
      .then(json => {
        setState(prevState => ({
          ...prevState,
          isAvailableEmail: json === true,
          timer: 180, // 3분 타이머 설정
          isButtonDisabled: true,
          snackbar: {
            ...newState,
            open: true,
            message: json === true ? "인증번호가 전송되었습니다." : "이미 가입 이력이 있는 이메일입니다."
          }
        }));
      });
  };

  const verifyCode = (newState) => () => {
    fetch(`${backend}/api/v1/member/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: state.email,
        code: state.emailVerifyCode
      })
    })
      .then(result => result.json())
      .then(json => {
        setState(prevState => ({
          ...prevState,
          isEmailVerified: json === true,
          snackbar: {
            ...newState,
            open: true,
            message: json === true ? '인증이 완료 되었습니다' : '인증에 실패했습니다. 인증번호를 확인해주세요'
          }
        }));
      });
  };

  const verifyNickname = () => {
    fetch(`${backend}/api/v1/member/check-nickname?nickname=${state.nickname}`)
      .then(result => result.json())
      .then(json => {
        setState(prevState => ({
          ...prevState,
          isNicknameVerified: json === false,
          snackbar: {
            ...prevState.snackbar,
            open: true,
            message: json === false ? '사용 가능한 닉네임입니다.' : '사용 불가능한 닉네임입니다'
          }
        }));
      });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox onChange={(e) => setState(prevState => ({ ...prevState, checked: e.target.checked }))} color="primary" />}
                label="회원가입에 동의합니다."
              />
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type='email'
                  label='이메일'
                  onChange={(e) => setState(prevState => ({ ...prevState, email: e.target.value }))}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }}>
                <Button
                  onClick={sendVerifyCode({ vertical: 'bottom', horizontal: 'center' })}
                  disabled={state.isButtonDisabled}
                >
                  인증번호 전송 {state.isButtonDisabled && `(${formatTime(state.timer)})`}
                </Button>
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  onClose={handleSnackbarClose}
                  message={message}
                  key={vertical + horizontal}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type='number'
                  label='인증 번호'
                  onChange={(e) => setState(prevState => ({ ...prevState, emailVerifyCode: e.target.value }))}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }}>
                <Button onClick={verifyCode({ vertical: 'bottom', horizontal: 'center' })}>
                  인증번호 확인
                </Button>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              onChange={(e) => setState(prevState => ({ ...prevState, nickname: e.target.value }))}
              label='닉네임'
            />
            <Button variant='primary' onClick={verifyNickname}>닉네임 중복확인</Button>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='password'
                label='비밀번호'
                placeholder='숫자+영문자+특수문자 2개 이상 조합 8자리 이상'
                onChange={handlePasswordChange}
              />
              {state.isPasswordValid && <Alert severity='success'>유효한 비밀번호입니다.</Alert>}
              {!state.isPasswordValid && <Alert severity='warning'>숫자, 영문자, 특수문자 중 두 개 이상을 포함하여 8자리 이상을 입력하세요</Alert>}
              <TextField
                sx={{ marginTop: '8px' }}
                fullWidth
                type='password'
                label='비밀번호 확인'
                placeholder='비밀번호를 다시 한 번 입력해주세요'
                onChange={handlePasswordConfirmChange}
              />
              {state.password !== state.passwordConfirm && <Alert severity='warning'>비밀번호가 일치하지 않습니다.</Alert>}
              {state.password === state.passwordConfirm && state.password !== '' && <Alert severity='success'>비밀번호가 일치합니다.</Alert>}
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ width: '95%', margin: '0 auto', marginTop: 10 }}>
        <Stepper activeStep={state.activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                {renderStepContent(index)}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={!isNextButtonEnabled()}
                    >
                      {index === steps.length - 1 ? '완료' : '다음'}
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {state.activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>버튼을 눌러 회원가입을 완료하세요.</Typography>
            <Button sx={{ mt: 1, mr: 1 }} onClick={submit} >
              회원가입 완료
            </Button>
          </Paper>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
    </Container>
  );
}

export default Register;