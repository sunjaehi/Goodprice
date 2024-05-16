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

function Reviewinput() {
    /*
    const ImageInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1
    })
    */
    const imageInput = useRef();
    //const [imageSrc, setImageSrc] = useState(null);

    const uploadFile = useCallback((e) => {
        if (!e.target.files) {
            return;
        }

        console.log(e.target.files[0].name);
    },[]);
    const handleChange = useCallback(() => {
        if (!imageInput.current) {
            return;
        }
        imageInput.current.click();
    },[]);
    
    const reviewSubmit = (e) => {
        e.preventDefault();
    };
    
    
    const navigate = useNavigate();
    return (
        <FormGroup sx={{
            display:"flex",
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
                id="outlined-multiline-static"
                //label="리뷰"
                minRows={10}
                multiline
                placeholder="리뷰를 작성해주세요"
            />
            <Stack direction="row" justifyContent='flex-end'>
                <input type="file" accept="image/*" ref={imageInput} onChange={uploadFile} style={{display:'none'}}/>
                <Button label={<AddIcon />} onClick={handleChange} />
                
            </Stack>
            
            <Box 
                sx={{
                    display:"flex",
                    margin:"5",
                    flexDirection:"column",
                    alignItems:"center",
                    m:2
                }}
            >
                <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                        backgroundColor:"black",
                        color:"white",
                        borderColor:"black",
                        //mx:"10px",
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
                    onClick={navigate("/")}
                >취소</Button>
            </Box>
        </FormGroup>
    );
}
export default Reviewinput;
