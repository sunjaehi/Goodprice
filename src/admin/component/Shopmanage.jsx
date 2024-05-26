import React, { useState, useEffect, useRef } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

function ProductDialog({ open, handleClose, onAddButtonClicked, nameInput, priceInput, onChangeFile }) {

    const priceRef = useRef();
    const nameRef = useRef();
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>상품 추가</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={3}>
                    <TextField label="상품명" fullWidth variant="outlined" margin="normal" inputRef={nameInput} />
                    <TextField label="가격" fullWidth variant="outlined" margin="normal" inputRef={priceInput} />
                    <input type="file" accept="image/*" onChange={onChangeFile} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onAddButtonClicked}>추가</Button>
                <Button onClick={handleClose}>취소</Button>
            </DialogActions>
        </Dialog>
    );
}

function ProductEditDialog({ product, editFormOpen, setEditFormOpen }) {
    const [imageDeleted, setImageDeleted] = useState(false);
    const newPriceRef = useRef();

    const handleImageDelete = () => {
        setImageDeleted(true);
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('id', product.id);
        formData.append('attachmentId', product.attachmentId);
        formData.append('price', newPriceRef.current.value);
        formData.append('isDeleteImage', imageDeleted);
        fetch('http://localhost:8080/api/v1/product/edit', {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('atk')}`
            },
            body: formData
        }).then(response => {
            if (response.status === 200) {
                alert('수정 완료!');
                setEditFormOpen(false);
            } else {
                alert('수정 실패ㅜ');
            }
        })
    };

    return (
        <Dialog open={editFormOpen}>
            <DialogTitle>상품 수정</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={3}>
                    <TextField defaultValue={product.name} fullWidth variant="outlined" margin="normal" disabled />
                    <TextField label="가격" fullWidth variant="outlined" margin="normal" defaultValue={product.price} inputRef={newPriceRef} />
                    {product.imgUrl && !imageDeleted ? (
                        <>
                            <img src={product.imgUrl} alt="상품 이미지" />
                            <Button onClick={handleImageDelete}>이미지 삭제</Button>
                        </>
                    ) : (
                        <>
                            <input type="file" accept="image/*" />
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEdit}>수정</Button>
                <Button onClick={() => setEditFormOpen(false)}>취소</Button>
            </DialogActions>
        </Dialog>
    );
}


export default function Shopmanage() {
    const navigate = useNavigate();
    const { shopId } = useParams();
    const [shopInfo, setShopInfo] = useState(null);
    const [productInfo, setProductInfo] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [is24Hours, setIs24Hours] = useState(false);
    const [open, setOpen] = useState(false);
    const nameInput = useRef();
    const priceInput = useRef();
    const [editFormOpen, setEditFormOpen] = useState(false);
    const defaultImageUrl = 'https://via.placeholder.com/150';


    function parseTimeString(timeString) {
        if (timeString === null)
            return [null, null];

        const [start, end] = timeString.split(' - ');
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        const startDate = dayjs().hour(startHours).minute(startMinutes);
        const endDate = dayjs().hour(endHours).minute(endMinutes);

        return [startDate, endDate];
    };

    useEffect(() => {
        const fetchData = async () => {
            let result = await fetch(`http://localhost:8080/api/v1/shop/${shopId}`);
            if (result.status === 404) {
                alert('존재하지 않는 가게입니다');
                navigate(-1);
                return;
            }
            let json = await result.json();
            setShopInfo(json);

            if (json.businessHours === "00:00 - 24:00") {
                setIs24Hours(true);
            } else {
                if (json.businessHours !== "") {
                    const [parsedStartTime, parsedEndTime] = parseTimeString(json.businessHours);
                    setStartTime(parsedStartTime);
                    setEndTime(parsedEndTime);
                }
            }

            result = await fetch(`http://localhost:8080/api/v1/product/?shopId=${shopId}`);
            json = await result.json();
            setProductInfo(json);
        }
        fetchData();
    }, [shopId, navigate])

    const handle24HoursChange = (event) => {
        setIs24Hours(event.target.checked);
    };

    const navigateToMainadmin = () => {
        navigate("/Mainadmin");
    }

    const handleOpen = (e) => {
        setOpen(true);
    }

    const [selectedFiles, setSelectedFiles] = useState([]);
    const onChangeFile = (e) => {
        let files = Array.from(e.target.files);
        setSelectedFiles(files);
        const previews = files.map(file => {
            return URL.createObjectURL(file);
        });
    }

    const handleAddButtonClicked = async (e) => {
        const formData = new FormData();
        formData.append('shopId', shopId);
        formData.append('name', nameInput.current.value);
        formData.append('price', priceInput.current.value);
        selectedFiles.forEach(file => formData.append('files', file));

        const result = await fetch('http://localhost:8080/api/v1/product/new',
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('atk')}`
                },
                body: formData,
            }
        )
        if (result.status === 201) {
            alert('등록 성공!');
            setOpen(false);
        }
    }

    const onFormChange = (e) => {
        setShopInfo({ ...shopInfo, [e.target.name]: e.target.value });
    }

    const handleClose = (e) => {
        setOpen(false);
    }

    const handleEditButtonClicked = (productId) => {
        setEditFormOpen(productId);
    };

    const handleCloseEditForm = () => {
        setEditFormOpen(null);
    };


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
                        <TextField
                            disabled
                            label="상호명"
                            value={shopInfo.shopName}
                            variant="outlined"
                        />
                        <TextField
                            name="phone"
                            label="연락처"
                            multiline
                            variant="outlined"
                            value={shopInfo.phone}
                            onChange={onFormChange}
                        />
                        <TextField
                            name="boast"
                            label="자랑거리"
                            multiline
                            variant="outlined"
                            value={shopInfo.boast}
                            onChange={onFormChange}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker', 'TimePicker']}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TimePicker
                                        label="시작시간"
                                        value={startTime}
                                        onChange={newValue => setStartTime(newValue)}
                                        sx={{ width: "50%" }}
                                        disabled={is24Hours}
                                    />
                                    <TimePicker
                                        label="종료시간"
                                        value={endTime}
                                        onChange={newValue => setEndTime(newValue)}
                                        sx={{ width: '50%' }}
                                        disabled={is24Hours}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={is24Hours}
                                                onChange={handle24HoursChange}
                                            />
                                        }
                                        label="24시간"
                                    />
                                </Stack>
                            </DemoContainer>
                        </LocalizationProvider>
                        <TextField
                            name="info"
                            label="기타정보"
                            multiline
                            variant="outlined"
                            value={shopInfo.info}
                            onChange={onFormChange}
                        />

                        <Typography variant="h7">상품 목록</Typography>
                        <Button variant="outlined" onClick={handleOpen}>상품 추가</Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>상품 추가</DialogTitle>
                            <DialogContent>
                                <Stack direction="column" spacing={3} style={{ marginTop: 8, marginBottom: 8 }}>
                                    <TextField label="상품명" fullWidth variant="outlined" margin="normal" inputRef={nameInput} />
                                    <TextField label="가격" fullWidth variant="outlined" margin="normal" inputRef={priceInput} />
                                    <input type="file" accept="image/*" onChange={onChangeFile} />
                                </Stack>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleOpen}>추가</Button>
                                <Button onClick={handleClose}>취소</Button>
                            </DialogActions>
                        </Dialog>
                        <Grid container spacing={3}>
                            {productInfo && productInfo.map(product => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card>
                                        <input type="hidden" value={product.id} />
                                        <CardMedia
                                            component="img"
                                            sx={{ height: 100 }}
                                            image={product.imgUrl || defaultImageUrl}
                                            title="item"
                                            alt={product.imgUrl ? "" : "이미지 없음"}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" component="div">{product.name}</Typography>
                                            <TextField value={product.price} variant="outlined" sx={{ mt: "5px" }} fullWidth />
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => handleEditButtonClicked(product.id)}>수정</Button>
                                            <Button size="small">삭제</Button>
                                        </CardActions>
                                    </Card>
                                    {editFormOpen === product.id && (
                                        <ProductEditDialog
                                            product={product}
                                            editFormOpen={true} // 해당 상품의 ID가 editFormOpen과 일치할 때만 다이얼로그 열기
                                            setEditFormOpen={setEditFormOpen}
                                            handleCloseEditForm={handleCloseEditForm}
                                        />
                                    )}
                                    {productInfo && productInfo.length === 0 && (<p>아직 상품이 없어요</p>)}
                                </Grid>
                            ))}
                            {productInfo && productInfo.length === 0 && (<p>아직 상품이 없어요</p>)}
                        </Grid>

                        <ProductDialog
                            open={open}
                            handleClose={handleClose}
                            onAddButtonClicked={handleAddButtonClicked}
                            nameInput={nameInput}
                            priceInput={priceInput}
                            onChangeFile={onChangeFile}
                            isModify={false}
                        />

                        <Stack
                            direction="row-reverse"
                            gap={3}
                        >
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    mr: '10px',
                                    borderRadius: "15px",
                                    backgroundColor: "black",
                                    ":hover": { backgroundColor: "grey" }
                                }}
                            >수정</Button>
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
