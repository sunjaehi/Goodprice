import React, { useState, useEffect } from 'react';
import { Container, FormControlLabel, Switch, Typography, Grid, Box, Button } from '@mui/material';

const backend = process.env.REACT_APP_BACKEND_ADDR;

const NotificationSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(false);

    useEffect(() => {
        fetch(`${backend}/api/v1/member/notification-setting`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('atk')
            }
        }
        )
            .then(response => response.json())
            .then(json => {
                setEmailNotifications(json.emailFlag);
                setPushNotifications(json.fcmFlag);

            })
    }, []);

    const handleEmailToggle = () => {
        setEmailNotifications(!emailNotifications);
    };

    const handlePushToggle = () => {
        setPushNotifications(!pushNotifications);
    };

    const handleSave = () => {
        fetch(`${backend}/api/v1/member/change-notification-setting`, {
            method: 'PATCH',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('atk'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailFlag: emailNotifications,
                fcmFlag: pushNotifications,
            }),
        })
            .then(response => {
                if (response.status === 200) alert('알림 설정 저장에 성공하였습니다');
                else alert('알림 설정 저장에 실패하였습니다');
            })
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h5" textAlign="center" gutterBottom sx={{marginTop:8, marginBottom: 4}}>
                알림 설정
            </Typography>
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                        <Typography variant="h6">
                            이메일 알림
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications}
                                    onChange={handleEmailToggle}
                                    name="emailNotifications"
                                    color="primary"
                                />
                        }
                        
                    />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        이메일 알림을 설정하면 <br/>관심 지역 가게 알림을 받을 수 있습니다.
                    </Typography>
                    
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                        <Typography variant="h6">
                            푸시 알림
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={pushNotifications}
                                    onChange={handlePushToggle}
                                    name="pushNotifications"
                                    color="primary"
                                />
                            }
                            
                        />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary">
                        푸시 알림을 설정하면 관심 지역의 가게 추가 알림, <br/>관심 가게의 새 소식 알림을 받을 수 있습니다.
                    </Typography>
                    
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        저장하기
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NotificationSettings;