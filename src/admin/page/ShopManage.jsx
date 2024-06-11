import Box from '@mui/material/Box';
import Adminlist from "../section/Adminlist";
import Shoptable from '../section/Shoptable';


export default function ShopManage() {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
        }}>
            <Adminlist />
            <Shoptable />
        </Box>
    )
}
