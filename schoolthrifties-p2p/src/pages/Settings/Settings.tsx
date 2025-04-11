import { SyntheticEvent,  useEffect, useState } from "react";
import {
    Box,
    Tab,
    Tabs,
    Stack,
    Typography,
} from "@mui/material";
import BankingDetailsSettings from "../../components/Settings/BankingDetails";
import ProfileSettings from "../../components/Settings/Profile";
import ShopSettings from "../../components/Settings/Shop";
import ShippingSettings from "../../components/Settings/Shipping";
import { useUserStore } from '../../stores/useUserStore';
import PageHeader from "../../components/PageHeader/PageHeader";

const Settings = () => {
    const [activeTab, setActiveTab] = useState(0);
    const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);


    const handleChangeTab = (_event: SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
    }, [])
    return (
        <>
            {!user
                ? (
                    <>
                        <PageHeader header="Settings" />
                        <Typography fontSize={16} fontWeight={300}>
                            Please login to view your settings
                        </Typography>
                    </>

                )
                : (<Box
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
                            <ShippingSettings shopId={user?.shop_id} />
                        )}

                        {activeTab === 3 && (
                            <BankingDetailsSettings />
                        )}
                    </Stack>
                </Box>)
            }
        </>
    );
};

export default Settings;
