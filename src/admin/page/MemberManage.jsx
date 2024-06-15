import React from "react";
import Adminlist from "../section/Adminlist";
import { Box } from "@mui/material";
import MemberTable from "../section/MemberTable";

export default function MemberManage() {
    return (
        <Box
            flexDirection="row"
            display="flex"
        >
            <Adminlist />
            <MemberTable />
        </Box>
    );
}