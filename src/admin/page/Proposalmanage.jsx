import React from "react";
import Adminlist from "../section/Adminlist";
import { Box } from "@mui/material";
import ProposalTable from "../section/ProposalTable";

function Proposalmanage() {
    return (
        <Box
            flexDirection="row"
            display="flex"
        >
            <Adminlist />
            <ProposalTable />
        </Box>

    );
}
export default Proposalmanage;