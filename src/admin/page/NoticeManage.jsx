import React from "react";
import Adminlist from "../section/Adminlist";
import NoticeTable from "../section/NoticeTable";
import { Box } from "@mui/material";

export default function NoticeManage() {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
        }}>
            <Adminlist />
            <NoticeTable />
        </Box>
    )
}