import Box from '@mui/material/Box';

import Adminlist from "../section/Adminlist";
import Shoptable from "../section/Shoptable";
import Divider from '@mui/material/Divider';

export default function Mainadmin() {
    return (
        <Box sx={{
            flexDirection:"row",
            display:"flex"
        }}>
            <Adminlist />
            <Divider />
            <Shoptable />
        </Box>
    )
}