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

const style = {
    position:'absolute',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display:'flex',
    flexDirection:'column'
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
            sx={{textDecoration:'none', color:'inherit'}}><AccountCircleIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        비회원
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2}} container direction="column">
                        <Button 
                            variant="outlined" 
                            size="large" 
                            startIcon={<LoginIcon />}
                            onClick={navigateToLogin}
                        >
                            로그인
                        </Button>
                        <Button 
                            variant="outlined"
                            size="large" 
                            startIcon={<PersonAddIcon />}
                            onClick={navigateToRegister}
                        >
                            회원가입
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
export default Mymodal;