import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const backend = process.env.REACT_APP_BACKEND_ADDR;

export default function ProposalHistory() {
    const [proposals, setProposals] = useState([]);
    const [details, setDetails] = useState({});
    const accessToken = sessionStorage.getItem('atk');

    useEffect(() => {
        fetch(`${backend}/api/v1/proposal/list`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => setProposals(data))
            .catch(error => console.error('Error fetching proposals:', error));
    }, [backend, accessToken]);

    const handleAccordionChange = (id) => (event, isExpanded) => {
        if (isExpanded && !details[id]) {
            fetch(`${backend}/api/v1/proposal/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => response.json())
                .then(data => setDetails(prevDetails => ({ ...prevDetails, [id]: data })))
                .catch(error => console.error(`Error fetching details for proposal ${id}:`, error));
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: '72px' }}>
            <Box mt={5}>
                <Typography variant="h6" gutterBottom>
                    착한 가게로 등록 요청한 내역들이에요
                </Typography>
                {proposals.map((proposal) => (
                    <Accordion key={proposal.id} onChange={handleAccordionChange(proposal.id)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${proposal.id}-content`}
                            id={`panel${proposal.id}-header`}
                        >
                            <Typography>
                                {proposal.shopName} - {proposal.status} <br />
                                {proposal.createdAt}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {details[proposal.id] ? (
                                <Typography>
                                    <strong>가게 이름:</strong> {details[proposal.id].shopName}<br />
                                    <strong>가제 주소:</strong> {details[proposal.id].shopAddress}<br />
                                    <strong>가게 연락처:</strong> {details[proposal.id].shopPhone}<br />
                                    <strong>영업 시간:</strong> {details[proposal.id].businessHours}<br />
                                    <strong>기타 정보:</strong> {details[proposal.id].info}<br />
                                    <strong>요청 사유:</strong> {details[proposal.id].reason}<br />
                                    <strong>Sector ID:</strong> {details[proposal.id].sectorId}<br />
                                    <strong>우편번호:</strong> {details[proposal.id].zipcode}<br />
                                    <strong>상태:</strong> {details[proposal.id].status}<br />
                                </Typography>
                            ) : (
                                <Typography>Loading...</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Container>
    );
}
