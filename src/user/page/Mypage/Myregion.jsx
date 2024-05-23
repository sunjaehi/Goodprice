import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { regionSample } from "../../data/regionSample";
import { Container, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

function Myregion() {
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [deselectedRegions, setDeselectedRegions] = useState([]);

    const handleChange = (event) => {
        const regionId = event.target.value;
        const isChecked = event.target.checked;

        setSelectedRegions((prevSelectedRegions) => {
            if (isChecked) {
                return [...prevSelectedRegions, regionId];
            } else {
                return prevSelectedRegions.filter((id) => id !== regionId);
            }
        });

        setDeselectedRegions((prevDeselectedRegions) => {
            if (!isChecked) {
                return [...prevDeselectedRegions, regionId];
            } else {
                return prevDeselectedRegions.filter((id) => id !== regionId);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("선택된 지역:", selectedRegions);
        console.log("꺼진 지역:", deselectedRegions);
    };

    return (
        <Container maxWidth="sm">
            <Button variant="outlined" fullWidth onClick={handleSubmit}>적용</Button>
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
