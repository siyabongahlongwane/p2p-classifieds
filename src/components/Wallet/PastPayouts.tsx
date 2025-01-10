import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useToastStore from "../../stores/useToastStore";
import useApi from "../../hooks/useApi";

interface Payout {
    payout_id: number;
    dateCreated: string;
    datePaid: string | null; // Null if not yet paid
    amount: string;
    status: "Pending" | "Paid";
}
const PastPayouts = ({ user_id }: { user_id: number }) => {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const columns: GridColDef[] = [
        { field: "payout_id", headerName: "ID", width: 90 },
        {
            field: "createdAt", headerName: "Date Created", width: 200, valueGetter: (params: any) =>
                params.split('T')[0]
        },
        {
            field: "datePaid",
            headerName: "Date Paid",
            width: 180,
            valueGetter: (params: any) =>
                params?.row?.datePaid || "Not Paid Yet",
        },
        { field: "amount", headerName: "Amount (R)", width: 180 },
        { field: "status", headerName: "Status", width: 180 },
    ];
    const { showToast } = useToastStore();
    const { post } = useApi(`${import.meta.env.VITE_API_URL}`);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const payouts = await post(`/payouts/fetch-payouts`, { user_id });
                if (!payouts) throw new Error('Error fetching payouts');

                setPayouts(payouts.map((payout: any) => ({
                    id: payout.payout_id,
                    ...payout
                })))

            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        }

        fetchWallet();
    }, [user_id]);

    return (

        <Box sx={{ height: 400, width: "100%" }}>
            <Typography variant="body1" fontSize={18} fontWeight={500} gutterBottom>
                Past Payouts
            </Typography>
            <DataGrid rows={payouts} columns={columns} pagination pageSizeOptions={[5]} />
        </Box>
    )
}

export default PastPayouts;