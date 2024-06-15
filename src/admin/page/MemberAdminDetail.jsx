import React, { useState, useEffect } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button, Typography, Card, CardContent, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function MemberAdminDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [fcmToken, setFcmToken] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            let result = await fetch(`${backend}/api/v1/member/info?memberId=${id}`);
            if (result.status === 404) {
                alert('존재하지 않는 회원입니다');
                navigate(-1);
                return;
            }
            let json = await result.json();
            setMemberInfo(json);
            setFcmToken(json.fcmToken || '');
        }
        fetchData();
    }, [id, navigate]);

    const handleFcmTokenChange = (event) => {
        setFcmToken(event.target.value);
    };

    const updateFcmToken = () => {
        fetch(`${backend}/api/v1/member/update-fcm-by-admin`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ memberId: id, fcmToken: fcmToken })
        })
            .then(response => {
                if (response.status === 200) {
                    alert('FCM 토큰 업데이트 완료');
                } else {
                    alert('FCM 토큰 업데이트 실패');
                }
            });
    };

    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", p: 3 }}>
            <Adminlist />
            <Divider orientation="vertical" flexItem />
            {memberInfo && (
                <Card sx={{ flex: 1, ml: 3, p: 3 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>회원 상세 정보</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <Typography variant="body1"><strong>회원 PK ID:</strong> {memberInfo.id}</Typography>
                            <Typography variant="body1"><strong>이메일:</strong> {memberInfo.email}</Typography>
                            <Typography variant="body1"><strong>닉네임:</strong> {memberInfo.nickname}</Typography>
                            <Typography variant="body1"><strong>권한:</strong> {memberInfo.role}</Typography>
                            <Typography variant="body1"><strong>가입일:</strong> {memberInfo.joinedAt}</Typography>
                            <Typography variant="body1"><strong>최종 개인정보 수정일:</strong> {memberInfo.updatedAt}</Typography>
                            <Typography variant="body1"><strong>활성화 여부:</strong> {memberInfo.isAvailable ? '예' : '아니오'}</Typography>
                            <Typography variant="body1"><strong>이메일 알림 사용 여부:</strong> {memberInfo.emailFlag ? '예' : '아니오'}</Typography>
                            <Typography variant="body1"><strong>FCM 알림 사용 여부:</strong> {memberInfo.fcmFlag ? '예' : '아니오'}</Typography>
                            <TextField
                                label="FCM 토큰"
                                variant="outlined"
                                value={fcmToken}
                                onChange={handleFcmTokenChange}
                                fullWidth
                            />
                        </Stack>
                        <Stack direction="row-reverse" gap={2} mt={3}>
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={updateFcmToken}
                            >
                                FCM 토큰 업데이트
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "lightgrey",
                                    color: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={navigateToMainadmin}
                            >
                                취소
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
