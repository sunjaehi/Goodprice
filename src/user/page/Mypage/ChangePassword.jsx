import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_ADDR;

function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setNewPassword(newPassword);
        setIsPasswordVerified(validatePassword(newPassword) && newPassword === confirmPassword);
    };

    const handlePasswordConfirmChange = (e) => {
        const newPasswordConfirm = e.target.value;
        setConfirmPassword(newPasswordConfirm);
        setIsPasswordVerified(validatePassword(newPassword) && newPassword === newPasswordConfirm);
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setSnackbarMessage("새 비밀번호가 일치하지 않습니다.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const atk = sessionStorage.getItem('atk');
        if (atk === null) {
            alert('로그인이 필요합니다');
            navigate(-1);
            return;
        }

        fetch(`${backend}/api/v1/member/change-password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + atk
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        }).then(response => {
            if (response.status === 200) {
                setSnackbarMessage("비밀번호가 변경되었습니다.");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                navigate("/mypage");
            } else if (response.status === 400) {
                setSnackbarMessage("현재 비밀번호가 올바르지 않습니다.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage("서버 오류가 발생했습니다.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', marginBottom: 4, marginTop: 8 }}>
                <Typography variant="h5">비밀번호 변경</Typography>
                <Typography variant="subtitle1">새 비밀번호를 입력하세요.</Typography>
            </Box>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="현재 비밀번호"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    required
                    sx={{ marginBottom: 4 }}
                />
                <TextField
                    label="새 비밀번호"
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                />
                {!validatePassword(newPassword) && (
                    <Alert severity='warning'>숫자, 영문자, 특수문자 중 두 개 이상을 포함하여 8자리 이상을 입력하세요</Alert>
                )}
                {validatePassword(newPassword) && (
                    <Alert severity='success'>사용 가능한 비밀번호입니다.</Alert>
                )}
                <TextField
                    label="새 비밀번호 확인"
                    type="password"
                    value={confirmPassword}
                    onChange={handlePasswordConfirmChange}
                    fullWidth
                    required
                />
                {newPassword !== confirmPassword && confirmPassword && (
                    <Alert severity='warning'>비밀번호가 일치하지 않습니다.</Alert>
                )}
                {newPassword === confirmPassword && validatePassword(newPassword) && (
                    <Alert severity='success'>비밀번호가 일치합니다.</Alert>
                )}
                <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={!isPasswordVerified}>
                    비밀번호 변경
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ChangePassword;