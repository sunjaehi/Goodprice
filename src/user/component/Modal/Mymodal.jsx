import React,{ useState } from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';

const style = {
    position:'absolute',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 20,
    p: 4,     
};

function Mymodal() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate=useNavigate();
    
    const navigateToRegister = () => {
        handleClose();
        navigate("/Register");
    }
    const navigateToLogin = () => {
        handleClose();
        navigate("/Login");
    }

    return (
        <div>
            <Button onClick={handleOpen}
            sx={{textDecoration:'none', color:'white'}}><AccountCircleIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                        비회원
                    </Typography>
                    <Typography id="modal-modal-description" 
                                sx={{ 
                                    mt: 2,
                                    textAlign:"center"
                                }}  
                    >
                    <Stack spacing={2} direction="column">
                        
                        <Button 
                            sx={{bgcolor:'#435585',
                                color:'white',
                                ":hover" : {
                                    bgcolor:"#435585"
                                }
                            }}
                            variant="contained" 
                            size="large" 
                            startIcon={<LoginIcon />}
                            onClick={navigateToLogin}
                        >
                            로그인
                        </Button>
                        <Button 
                            sx={{bgcolor:'#435585',
                            color:'white',
                            ":hover" : {
                                bgcolor:"#435585"
                            }
                        }}
                            variant="contained"
                            size="large" 
                            startIcon={<PersonAddIcon />}
                            onClick={navigateToRegister}
                        >
                            회원가입
                        </Button>
                    </Stack>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
export default Mymodal;