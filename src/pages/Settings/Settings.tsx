import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Tab,
    Tabs,
    Stack,
} from "@mui/material";
import BankingDetailsSettings from "../../components/Settings/BankingDetails";
import ProfileSettings from "../../components/Settings/Profile";
import ShopSettings from "../../components/Settings/Shop";
import ShippingSettings from "../../components/Settings/Shipping";

const Settings = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    const onSubmit = (data) => {
        console.log("Updated Data:", data);
        // Add logic to send data to the server
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                minHeight: "100vh",
            }}
        >
            <Stack sx={{ p: 4, width: "500px" }}>
                <Tabs
                    value={activeTab}
                    onChange={handleChangeTab}
                    centered
                    sx={{ mb: 4 }}
                >
                    <Tab label="Profile" />
                    <Tab label="Shop" />
                    <Tab label="Shipping" />
                    <Tab label="Banking Details" />
                </Tabs>

                {activeTab === 0 && (
                    <ProfileSettings />
                )}

                {activeTab === 1 && (
                    <ShopSettings />
                )}

                {activeTab === 2 && (
                    <ShippingSettings />
                )}

                {activeTab === 3 && (
                    <BankingDetailsSettings />
                )}
            </Stack>
        </Box>
    );
};

export default Settings;
