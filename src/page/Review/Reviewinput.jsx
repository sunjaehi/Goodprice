import React, { useRef, useState } from "react";
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormLabel from "@mui/material/FormLabel";
import { Divider } from "@mui/material";
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from "react-router-dom";
import './Reviewinput.css';

function Reviewinput() {
    const imageInput = useRef(null);
    const commentInput = useRef(null);
    const [imageSrc, setImageSrc] = useState('');
    const { shopId } = useParams();

    const navigate = useNavigate();
    const uploadFile = (fileBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve) => {
            reader.onload = () => {
                setImageSrc(reader.result);
                resolve();
            };
        });
    };

    const reviewSubmit = (e) => {
        const formData = new FormData();
        formData.append('comment', commentInput.current.value);
        formData.append('shopId', shopId);

        e.preventDefault();
        fetch(`http://localhost:8080/api/v1/review/`, {
            method: "POST",
            headers: {
                "Contend-Type": "multipart/form-data",
                "Authorization": "Bearer " + sessionStorage.getItem("atk")
            },
            body: formData,
        })
            .then((response) => {
                if (response.status === 201) {
                    alert('리뷰 등록 성공')
                } else {
                    alert('리뷰 등록 실패')
                }
                navigate(-1);
            })

    };


    return (
        <FormGroup sx={{
            display: "flex",
            id: "reviewForm"

        }}>
            <FormLabel sx={{
                fontSize: "20px",
                color: "black",
                justifyContent: "flex-start",
                margin: "10px",

            }}>리뷰</FormLabel>
            <Divider />
            <TextField
                sx={{
                    margin: "10px"
                }}
                id="review"
                inputRef={commentInput}
                //label="리뷰"
                minRows={10}
                name="input"
                multiline
                placeholder="리뷰를 작성해주세요"
            />
            <Stack direction="row" justifyContent='flex-end'>
                {/* <input type="file" accept="image/*" ref={imageInput}/> */}
                {/* <Button label htmlFor={<AddIcon />} onClick={uploadFile}></Button>  */}
                <label for="file">
                    <div className="btn-upload"><AddIcon /></div>
                </label>
                <input type="file" multiple={true} accept="image/*" ref={imageInput} id="file" onChange={(e) => { uploadFile(e.target.files[0]) }} />
                <div className="preview">
                    {imageSrc && <img src={imageSrc} alt="preview-img" />}
                </div>
            </Stack>

            <Box
                sx={{
                    display: "flex",
                    margin: "10px",
                    flexDirection: "column",
                    alignItems: "center",
                    //m:2
                }}
            >
                <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                        backgroundColor: "black",
                        color: "white",
                        borderColor: "black",
                        mx: "10px",
                        width: "100%",
                        ":hover": {
                            backgroundColor: "gray"
                        }
                    }}
                    onClick={reviewSubmit}
                >리뷰 등록</Button>
                <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                        backgroundColor: "lightgray",
                        color: "black",
                        borderColor: "lightgray",
                        margin: "10px",
                        width: "100%"
                    }}
                    onClick={navigate('/')}
                >취소</Button>
            </Box>
        </FormGroup>
    );
}
export default Reviewinput;
