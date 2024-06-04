import React, { useState, useRef } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  TextField,
  Box,
  FormControlLabel,
  Snackbar,
  Paper,
  Grid,
  Alert,
  Checkbox
} from '@mui/material';

const steps = [
  {
    label: '약관 동의',
    description: '약관에 동의하시면 회원가입이 완료됩니다.',
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

function StepContentComponent({ step, handleChange, formData }) {
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

  switch (step) {
    case 0:
      return (
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox onChange={handleAgree} color="primary" />}
              label="회원가입에 동의합니다."
            />
          </Grid>
        </Box>
      );
    case 1:
      return (
        <Box sx={{marginTop:2}}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                autoFocus
                fullWidth
                type='email'
                label='이메일'
                inputRef={emailInput}
                name='email'
                onChange={onEmailFormChange}
            />
          </Grid>
            <Grid item xs={4} sx={{mt:1}}>
              {button}
              <Snackbar
                anchorOrigin={{vertical, horizontal}}
                open={open}
                onClose={handleClose}
                message={isAvailableEmail ? "사용가능한 이메일입니다." : "이미 가입 이력이 있는 이메일입니다."}
                key={vertical + horizontal}
              />
            </Grid>
          </Grid>
          
        </Box>
      );
    case 2:
      return (
        <Box sx={{marginTop:2}}>
          <TextField
            fullWidth
            id='nickname'
            name='nickname'
            label='닉네임'
          />
        </Box>
      );
    default:
    return (
      <Box sx={{marginTop:2}}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type='password'
            id='password'
            name='password'
            label='비밀번호'
            placeholder='숫자+영문자+특수문자 8자리 이상'
            inputRef={passwordInput}
            onChange={onPasswordFormChange}
          />
        {!isAvailabePassword && <Alert severity='warning'>숫자, 영문자, 특수문자 중 하나 이상을 포함하여 8자리 이상을 입력하세요</Alert>}
        {isAvailabePassword && <Alert severity='success'>사용 가능한 비밀번호입니다.</Alert>}
      </Grid>
      </Box>
      
      
    );
  }
}

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setFormData({
  //     email: '',
  //     nickname: '',
  //     password: '',
  //   });
  // };

  return (
    <Box sx={{ width: '50%', margin: 'auto', marginTop: 10 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <StepContentComponent
                step={index}
                handleChange={handleChange}
                formData={formData}
              />
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1,
                      // bgcolor:'grey',
                      // color:'black',
                      // ":hover" : {
                      //   bgcolor:"lightgray"
                      // }
                    }}
                  >
                    {index === steps.length - 1 ? '완료' : '다음'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    이전
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
          <Button sx={{ mt: 1, mr: 1 }}>
            회원가입 완료
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Register;
