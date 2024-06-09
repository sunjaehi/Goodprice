import React, { useState, useEffect } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function ProposalAdminDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [shopInfo, setShopInfo] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [is24Hours, setIs24Hours] = useState(false);

    function parseTimeString(timeString) {
        if (timeString === null)
            return [null, null];

        const [start, end] = timeString.split('-');
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        const startDate = dayjs().hour(startHours).minute(startMinutes);
        const endDate = dayjs().hour(endHours).minute(endMinutes);

        return [startDate, endDate];
    };

    useEffect(() => {
        const fetchData = async () => {
            let result = await fetch(`${backend}/api/v1/proposal/${id}`);
            if (result.status === 404) {
                alert('존재하지 않는 요청입니다');
                navigate(-1);
                return;
            }
            let json = await result.json();
            setShopInfo(json);
            console.log(json);
            if (json.businessHours === "00:00 - 24:00") {
                setIs24Hours(true);
            } else {
                if (json.businessHours !== "") {
                    const [parsedStartTime, parsedEndTime] = parseTimeString(json.businessHours);
                    setStartTime(parsedStartTime);
                    setEndTime(parsedEndTime);
                }
            }
        }
        fetchData();
    }, [id, navigate])

    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
    }

    const approveProposal = () => {
        alert('test');
        fetch(`${backend}/api/v1/proposal/${shopInfo.id}/approval`, {
            method: "POST"
        })
            .then(response => {
                if (response.status === 200) {
                    alert('승인 완료');
                } else {
                    alert('승인 실패');
                }
            })
    }

    const rejectProposal = () => {
        fetch(`${backend}/api/v1/proposal/${shopInfo.id}/reject`)
            .then(response => {
                if (response.status === 200) {
                    alert('반려 완료');
                } else {
                    alert('반려 실패');
                }
            })
    }

    const approveAndRegister = () => {
        alert('test');
    }
    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
            }}>
                <Adminlist />
                <hr />
                {shopInfo && (
                    <Stack
                        component="form"
                        spacing={3}
                        autoComplete="off"
                        width="70%"
                        justifyContent="center"
                        margin={5}
                        ml={10}
                    >
                        <h1>등록 요청자</h1>
                        <p>{shopInfo.memberNickname}({shopInfo.memberEmail})</p>
                        <TextField
                            InputProps={{ readOnly: true }}
                            label="상호명"
                            variant="outlined"
                            value={shopInfo.shopName}
                        />
                        <TextField
                            InputProps={{ readOnly: true }}
                            label="연락처"
                            multiline
                            variant="outlined"
                            value={shopInfo.shopPhone}
                        />
                        <TextField
                            label="주소"
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            value={shopInfo.shopAddress}
                        />
                        <TextField
                            label="우편번호"
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            value={shopInfo.zipcode}
                        />
                        <TextField
                            InputProps={{ readOnly: true }}
                            label="기타정보"
                            multiline
                            variant="outlined"
                            value={shopInfo.info}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker', 'TimePicker']}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TimePicker
                                        label="시작시간"
                                        value={startTime}
                                        sx={{ width: "50%" }}
                                        disabled
                                    />
                                    <TimePicker
                                        label="종료시간"
                                        value={endTime}
                                        sx={{ width: '50%' }}
                                        disabled
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={is24Hours}
                                                disabled
                                            />
                                        }
                                        label="24시간"
                                    />
                                </Stack>
                            </DemoContainer>
                        </LocalizationProvider>
                        <TextField
                            name="reason"
                            label="요청 사유"
                            multiline
                            variant="outlined"
                            value={shopInfo.reason}
                        />

                        <Stack
                            direction="row-reverse"
                            gap={3}
                        >
                            < Button
                                variant="contained"
                                sx={{
                                    mr: '10px',
                                    borderRadius: "15px",
                                    backgroundColor: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={approveAndRegister}
                            >승인(등록 메뉴로 이동)</Button>
                            < Button
                                variant="contained"
                                sx={{
                                    mr: '10px',
                                    borderRadius: "15px",
                                    backgroundColor: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={approveProposal}
                            >승인</Button>
                            <Button
                                variant="contained"
                                sx={{
                                    mr: '10px',
                                    borderRadius: "15px",
                                    backgroundColor: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={rejectProposal}
                            >반려</Button>
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "lightgrey",
                                    color: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                                onClick={navigateToMainadmin}
                            >취소</Button>
                        </Stack>
                    </Stack>
                )}
            </Box >
        </>
    );
}
