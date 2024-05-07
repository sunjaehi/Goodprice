import React from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import PinIcon from '@mui/icons-material/Pin';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const defaultTheme = createTheme(); 

function Findpassword(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data=new FormData(event.currentTarget);
        console.log({
            password:data.get('password'),
        });
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop:8,
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                    }}
                >
                    <Avatar sx={{m:1, bgcolor:'secondary.main'}}>
                        <PinIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        비밀번호 찾기
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            color="secondary"
                            variant="contained"
                            sx={{mt:3, mb:2}}
                        >임시 비밀번호 요청하기</Button>
                            </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
    
}
export default Findpassword;