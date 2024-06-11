import React, { useState, useEffect } from "react";
import Adminlist from "../section/Adminlist";
import { Box, Stack, TextField, Button, FormControlLabel, Checkbox, Grid } from "@mui/material";
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
import ProductDialog from "./ProductDialog";
import ProductEditDialog from "./ProductEditDialog";

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function ShopAdminDetail() {
    const navigate = useNavigate();
    const { shopId } = useParams();
    const [shopInfo, setShopInfo] = useState(null);
    const [productInfo, setProductInfo] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [is24Hours, setIs24Hours] = useState(false);
    const [open, setOpen] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);

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
            let result = await fetch(`${backend}/api/v1/shop/${shopId}`);
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

            result = await fetch(`${backend}/api/v1/product/?shopId=${shopId}`);
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

    const deleteProduct = (id) => {
        fetch(`${backend}/api/v1/product/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("atk")}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    alert('삭제 성공!');
                }
            })
    }

    const onFileChange = (e) => {
        let files = Array.from(e.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...files]); // 새로운 파일들을 기존 파일들과 합침
    }

    const removeSelectedFile = (file) => {
        setSelectedFiles(prevFiles => prevFiles.filter(f => f !== file)); // 선택한 파일 삭제
    }

    const removeExistingFile = (fileUrl) => {
        setDeletedFiles([...deletedFiles, fileUrl]);

        // 이미지 URL을 삭제하면서 해당 이미지를 미리보여주는 컴포넌트가 표시하지 않도록 처리
        setShopInfo(prevShopInfo => ({
            ...prevShopInfo,
            shopImgUrls: prevShopInfo.shopImgUrls.filter(url => url !== fileUrl)
        }));

        // 선택한 파일 목록에서도 삭제
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileUrl));
    }

    const handleShopUpdate = async () => {
        const formData = new FormData();
        formData.append('shopId', shopId)
        formData.append('phone', shopInfo.phone);
        formData.append('boast', shopInfo.boast);
        formData.append('info', shopInfo.info);
        formData.append('businessHours', is24Hours ? "00:00 - 24:00" : `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`);
        selectedFiles.forEach(file => formData.append('newFiles', file));
        deletedFiles.forEach(fileUrl => formData.append('deletedFiles', fileUrl));

        const result = await fetch(`${backend}/api/v1/shop/edit`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('atk')}`
            },
            body: formData,
        });
        if (result.status === 200) {
            alert('수정 완료!');
            // navigateToMainadmin();
        } else {
            alert('수정 실패');
        }
    }

    const handleUnreigsterShop = async () => {
        fetch(`${backend}/api/v1/shop/unregister/${shopId}`,
            { method: "DELETE" }
        )
            .then(response => {
                if (response.status === 200) {
                    alert('지정해제 완료');
                    setShopInfo((prev) => ({
                        ...prev,
                        isAvailable: 0
                    }))
                }
                else alert('지정해제 실패');
            })
    }

    const handleReRegisterShop = async () => {
        fetch(`${backend}/api/v1/shop/re-register/${shopId}`,
            { method: "PATCH" }
        )
            .then(response => {
                if (response.status === 200) {
                    alert('재지정 성공');
                    setShopInfo((prev) => ({
                        ...prev,
                        isAvailable: 1
                    }))
                }
                else alert('재지정 실패');
            })
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

                        <Typography variant="h7">기존 첨부 사진</Typography>
                        <Grid container spacing={3}>
                            {shopInfo.shopImgUrls && shopInfo.shopImgUrls.map((image, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    {image && ( // 이미지 URL이 있는 경우에만 미리보기 표시
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                style={{
                                                    width: '100%'
                                                }}
                                                image={image}
                                                title="shop image"
                                            />
                                            <CardActions>
                                                {
                                                    image.startsWith("http://sftc.seoul.go.kr/mulga/inc/img_view.jsp?") === false && (<Button size="small" onClick={() => removeExistingFile(image)}>삭제</Button>)
                                                }
                                            </CardActions>
                                        </Card>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                        <Typography variant="h7">새로운 사진 추가</Typography>
                        <input type="file" accept="image/*" multiple onChange={onFileChange} />
                        <Grid container spacing={3}>
                            {selectedFiles.map((file, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: 100 }}
                                            image={URL.createObjectURL(file)}
                                            title="new shop image"
                                        />
                                        <CardActions>
                                            <Button size="small" onClick={() => removeSelectedFile(file)}>삭제</Button> {/* 선택한 파일 삭제 버튼 */}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h7">상품 목록</Typography>
                        <Button variant="outlined" onClick={handleOpen}>상품 추가</Button>
                        <Grid container spacing={3}>
                            {productInfo && productInfo.map(product => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card>
                                        <input type="hidden" value={product.id} />
                                        {product.imgUrl &&
                                            <CardMedia
                                                component="img"
                                                style={{
                                                    width: '100%',
                                                    position: 'relative',
                                                }}
                                                image={product.imgUrl}
                                                title="item"
                                            />
                                        }
                                        <CardContent>
                                            <Typography variant="h6" component="div">{product.name}</Typography>
                                            <Typography variant="body" >{product.price}원</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => handleEditButtonClicked(product.id)}>수정</Button>
                                            <Button size="small" onClick={() => deleteProduct(product.id)}>삭제</Button>
                                        </CardActions>
                                    </Card>
                                    {editFormOpen === product.id && (
                                        <ProductEditDialog
                                            product={product}
                                            editFormOpen={true}
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
                            shopId={shopId}
                        />

                        <Stack
                            direction="row-reverse"
                            gap={3}
                        >
                            {shopInfo && shopInfo.isAvailable ?
                                < Button
                                    variant="contained"
                                    onClick={handleUnreigsterShop}
                                    sx={{
                                        mr: '10px',
                                        borderRadius: "15px",
                                        backgroundColor: "black",
                                        ":hover": { backgroundColor: "grey" }
                                    }}
                                >지정해제</Button> :
                                < Button
                                    variant="contained"
                                    onClick={handleReRegisterShop}
                                    sx={{
                                        mr: '10px',
                                        borderRadius: "15px",
                                        backgroundColor: "black",
                                        ":hover": { backgroundColor: "grey" }
                                    }}
                                >재지정</Button>
                            }
                            <Button
                                variant="contained"
                                onClick={handleShopUpdate}
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
