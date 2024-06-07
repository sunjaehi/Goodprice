import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, StepContent, Button, Typography, TextField,
  Box, FormControlLabel, Snackbar, Paper, Grid, Alert, Checkbox
} from '@mui/material';

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

function Register() {
  const [isAvailableEmail, setIsAvailableEmail] = useState(false);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState(null);
  const [emailVerifyCode, setEmailVerifyCode] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, open } = state;
  const [activeStep, setActiveStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const isNextButtonEnabled = () => {
    switch (currentStep) {
      case 0:
        return checked;
      case 1:
        return isEmailVerified;
      case 2:
        return isNicknameVerified;
      case 3:
        return isPasswordVerified;
      default:
        return true;
    }
  };

  const submit = () => {
    fetch(`${backend}/api/v1/member/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        nickname: nickname,
        password: password
      })
    }).then(response => {
      response.status === 200 ? alert('회원가입 성공!') : alert('회원가입 실패ㅜ');
    });
  };

  const sendVerifyCode = (newState) => () => {
    fetch(`${backend}/api/v1/member/send-verification-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
      .then(response => response.json())
      .then(json => {
        setIsAvailableEmail(json === true);
        setTimer(180); // 3분 타이머 설정
        setIsButtonDisabled(true);
      });
    setState({ ...newState, open: true });
  };

  const verifyCode = (newState) => () => {
    fetch(`${backend}/api/v1/member/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        code: emailVerifyCode
      })
    })
      .then(result => result.json())
      .then(json => {
        setIsEmailVerified(json === true);
        alert(json === true ? '인증 완료!' : '인증 실패');
      });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const verifyNickname = () => {
    fetch(`${backend}/api/v1/member/check-nickname?nickname=${nickname}`)
      .then(result => result.json())
      .then(json => {
        alert(json === false ? '사용 가능한 닉네임입니다.' : '사용 불가능한 닉네임입니다');
        setIsNicknameVerified(json === false);
      });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordVerified(validatePassword(newPassword) && newPassword === passwordConfirm);
  };

  const handlePasswordConfirmChange = (e) => {
    const newPasswordConfirm = e.target.value;
    setPasswordConfirm(newPasswordConfirm);
    setIsPasswordVerified(validatePassword(password) && password === newPasswordConfirm);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox onChange={(e) => setChecked(e.target.checked)} color="primary" />}
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }}>
                <Button
                  onClick={sendVerifyCode({ vertical: 'top', horizontal: 'center' })}
                  disabled={isButtonDisabled}
                >
                  인증번호 전송 {isButtonDisabled && `(${formatTime(timer)})`}
                </Button>
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  onClose={handleClose}
                  message={isAvailableEmail ? "인증번호가 전송되었습니다." : "이미 가입 이력이 있는 이메일입니다."}
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
                  onChange={(e) => setEmailVerifyCode(e.target.value)}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }}>
                <Button onClick={verifyCode({ vertical: 'top', horizontal: 'center' })}>
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
              onChange={(e) => setNickname(e.target.value)}
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
              {!isPasswordVerified && <Alert severity='warning'>숫자, 영문자, 특수문자 중 두 개 이상을 포함하여 8자리 이상을 입력하세요</Alert>}
              {isPasswordVerified && <Alert severity='success'>사용 가능한 비밀번호입니다.</Alert>}
              <TextField
                sx={{ marginTop: '8px' }}
                fullWidth
                type='password'
                label='비밀번호 확인'
                placeholder='비밀번호를 다시 한 번 입력해주세요'
                onChange={handlePasswordConfirmChange}
              />
              {password !== passwordConfirm && <Alert severity='warning'>비밀번호가 일치하지 않습니다.</Alert>}
              {password === passwordConfirm && password !== '' && <Alert severity='success'>비밀번호가 일치합니다.</Alert>}
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '95%', margin: '0 auto', marginTop: 10 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
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
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>버튼을 눌러 회원가입을 완료하세요.</Typography>
          <Button sx={{ mt: 1, mr: 1 }} onClick={submit} >
            회원가입 완료
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Register;