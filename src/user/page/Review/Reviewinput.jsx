import React, { useRef, useState } from "react";
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormLabel from "@mui/material/FormLabel";
import { Divider, Rating } from "@mui/material";
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from "react-router-dom";
import './Reviewinput.css';

function Reviewinput() {
    const imageInput = useRef(null);
    const commentInput = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [score, setScore] = useState(0.0);
    const { shopId } = useParams();
    const navigate = useNavigate();
    const formData = new FormData();

    const reviewSubmit = (e) => {
        e.preventDefault();

        if (score === 0.0) {
            alert('별점을 입력해주세요!');
            return;
        }

        formData.append('comment', commentInput.current.value);
        formData.append('shopId', shopId);
        formData.append('score', score);

        selectedFiles.forEach(file => formData.append('files', file));

        fetch(`http://localhost:8080/api/v1/review/`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("atk")
            },
            body: formData,
        })
            .then((response) => {
                if (response.status === 201) {
                    alert('리뷰 등록 성공');
                } else {
                    alert('리뷰 등록 실패');
                }
                navigate(-1);
            });
    };

    const onChangeFile = (event) => {
        let newFiles = Array.from(event.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
        
        const newPreviews = newFiles.map(file=>URL.createObjectURL(file));
        setPreviews(prevPreviews =>[...prevPreviews, ...newPreviews]);
    }
    const removeImage = (index) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !==index));
        setPreviews(prevPreviews => prevPreviews.filter((_,i) => i !==index));                                                          
    }

    return (
        <form onSubmit={reviewSubmit}>
            <FormGroup sx={{ display: "flex", id: "reviewForm" }}>
                <FormLabel sx={{ fontSize: "20px", color: "black", justifyContent: "flex-start", margin: "10px" }}>
                    리뷰
                </FormLabel>
                <Divider />

                <TextField
                    sx={{ margin: "10px" }}
                    id="review"
                    inputRef={commentInput}
                    minRows={10}
                    name="input"
                    multiline
                    placeholder="리뷰를 작성해주세요"
                />
                <Box sx={{flexDirection:"row", display:"flex"}}>
                <p id="star">별점을 남겨주세요</p>
                <Rating sx={{margin:"10px"}} name="half-rating" defaultValue={0.0} precision={0.5} onChange={(event, newScore) => { setScore(newScore) }} />
                {/* <label htmlFor="file">
                    <div className="btn-upload"><AddIcon /></div>
                </label> */}

                </Box>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={imageInput}
                    id="file"
                    onChange={onChangeFile}
                    style={{ display: "none" }}
                />
                <Button startIcon={<AddIcon />} variant="contained"
                    sx={{
                        color:"black", backgroundColor:"lightgrey", 
                        margin:"10px",
                        ":hover" : {
                            backgroundColor:"grey"
                        }
                    }}
                    onClick={()=>imageInput.current.click()}
                >이미지 추가</Button>
                <div className="preview" style={{display:'flex', flexWrap:'wrap', marginTop:'10px'}}>
                    {previews.map((preview, index) => (
                        <div key={index} style={{position:'relative', margin:'10px'}}>
                            <img
                                //key={index}
                                alt="미리보기 제공 불가"
                                src={preview}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                            />
                            <Button
                                variant="contained"
                                color="eror"
                                onClick={() => removeImage(index)}
                                style={{position:'absolute', top:'5px', right:'5px', minwidth:'30px', minheight:'30px',pading:'5px'}}
                            >
                                X
                            </Button>
                        </div>
                    ))}
                </div>
                <Box
                    sx={{
                        display: "flex",
                        margin: "10px",
                        flexDirection: "column",
                        alignItems: "center",
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
                    >리뷰 등록</Button>
                    <Button
                        variant="outlined"
                        type="button"
                        sx={{
                            backgroundColor: "lightgray",
                            color: "black",
                            borderColor: "lightgray",
                            margin: "10px",
                            width: "100%"
                        }}
                        onClick={() => navigate('/')}
                    >취소</Button>
                </Box>
            </FormGroup>
        </form>
    );
}

export default Reviewinput;