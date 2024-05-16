import React,{ useRef,useEffect, useCallback,useState } from "react";
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormLabel from "@mui/material/FormLabel";
import { Divider, IconButton } from "@mui/material";
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import './Reviewinput.css';
import { set } from "react-hook-form";

function Reviewinput() {
    const imageInput = useRef(null);
    const [imageSrc, setImageSrc] = useState('');
    
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate("/");
    }
    // const uploadFile = useCallback(() => {
    //     imageInput.current.click();
    // },[imageInput.current]);
    // const handleChange = useCallback(() => {
    //     if (!imageInput.current) {
    //         return;
    //     }
    //     imageInput.current.click();
    // },[]);
    const uploadFile = (fileBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve)=>{
            reader.onload = () => {
                setImageSrc(reader.result);
                resolve();
            };
        });
    };
    const reviewForm = document.getElementById('review');
    const reviewSubmit = (e) => {
        e.preventDefault();
        
        fetch("API주소", {
            method:"POST",
            headers : {
                "Contend-Type":"multipart/form-data",
            },
            body:new FormData(reviewForm),
        })
            .then((response) => {
                if (response.ok === true) {
                    return response.json();
                }
                throw new Error('리뷰 작성 실패ㅠ !');
            })
            
    };
    
    
    return (
        <FormGroup sx={{
            display:"flex",
            id:"reviewForm"

        }}>
            <FormLabel sx={{
                fontSize:"20px",
                color:"black",
                justifyContent:"flex-start",
                margin:"10px",

            }}>리뷰</FormLabel>
            <Divider />
            <TextField
                sx={{
                    margin:"10px" 
                }}
                id="review"
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
                <input type="file" multiple={true} accept="image/*" ref={imageInput} id="file" onChange={(e)=>{uploadFile(e.target.files[0])}}/>
                <div className="preview">
                    {imageSrc && <img src={imageSrc} alt="preview-img" />}
                </div>
            </Stack>
            
            <Box 
                sx={{
                    display:"flex",
                    margin:"10px",
                    flexDirection:"column",
                    alignItems:"center",
                    //m:2
                }}
            >
                <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                        backgroundColor:"black",
                        color:"white",
                        borderColor:"black",
                        mx:"10px",
                        width:"100%",
                        ":hover":{
                            backgroundColor:"gray"
                        }
                    }}
                    onClick={reviewSubmit}
                >리뷰 등록</Button>
                <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                        backgroundColor:"lightgray",
                        color:"black",
                        borderColor:"lightgray",
                        margin:"10px",
                        width:"100%"
                    }}
                    onClick={navigateToHome}
                >취소</Button>
            </Box>
        </FormGroup>
    );
}
export default Reviewinput;
