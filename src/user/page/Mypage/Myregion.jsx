import React, { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { regionSample } from "../../../data/regionSample";
import { Container, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

function Myregion() {
    const [selected, setSelcted] = useState(new Set());
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/regionMark/', {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("atk")
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
        }).then(json => {
            console.log(json);
            setSelcted(new Set(json));
        })
    }, [])

    const handleChange = (event) => {
        const regionId = event.target.value;
        const isChecked = event.target.checked;

        setSelcted(prev => {
            const newSelected = new Set(prev);
            if (isChecked) newSelected.add(regionId);
            else newSelected.delete(regionId);

            return newSelected;
        })

        const bodyString = JSON.stringify(
            {
                regionId: regionId,
                isAdd: isChecked
            }
        )
        fetch(`http://localhost:8080/api/v1/regionMark/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("atk")
            },
            body: bodyString
        }).then(response => {
            if (response.status !== 200) alert('적용 실패....');
        })
    };

    return (
        <Container maxWidth="sm">
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {regionSample.map((region) => (
                    <React.Fragment key={region.id}>
                        <ListItem disablePadding>
                            <ListItemButton role={undefined}>
                                <ListItemText primary={region.name} />
                                <ListItemIcon>
                                    <Switch
                                        onChange={handleChange}
                                        value={region.id}
                                        checked={selected.has(region.id)}
                                        edge="start"
                                    />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
}

export default Myregion;
