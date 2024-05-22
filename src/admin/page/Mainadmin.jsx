import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import Adminlist from "../section/Adminlist";
import Shoptable from "../section/Shoptable";
import Divider from '@mui/material/Divider';
import Registershop from './Registershop';

export default function Mainadmin() {
    return (
        <Box sx={{
            display:"flex",
            flexDirection:"row",
            justifyContent:"center"

        }}>
            <Adminlist />
            <Shoptable />

        </Box>
        
    )
    // return (
    //     <>
    //         <Registershop />
    //     </>
    // )
}
