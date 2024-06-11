import Box from '@mui/material/Box';
import Adminlist from "../section/Adminlist";
import Shoptable from '../section/Shoptable';
import ShopPendingTable from '../section/ShopPendingTable';


export default function ShopPendingManage() {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
        }}>
            <Adminlist />
            <ShopPendingTable />
        </Box>
    )
}
