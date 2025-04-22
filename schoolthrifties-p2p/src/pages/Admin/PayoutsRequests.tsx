import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useToastStore from "../../stores/useToastStore";
import useApi from "../../hooks/useApi";
import { Switch } from '@mui/material';

interface Payout {
    payout_id: number;
    dateCreated: string;
    datePaid: string | null; // Null if not yet paid
    amount: string;
    status: "Pending" | "Paid";
}
const PayoutsRequests = () => {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const columns: GridColDef[] = [
        { field: "payout_id", headerName: "ID", width: 90 },
        {
            field: "createdAt",
            headerName: "Date Created",
            width: 150,
            valueGetter: (params: string) => params.split('T')[0]
        },
        {
            field: "datePaid",
            headerName: "Date Paid",
            width: 180,
            valueGetter: (params: { row: Payout }) =>
                params?.row?.datePaid || "Not Paid Yet",
        },
        {
            field: "amount",
            headerName: "Amount (R)",
            width: 180
        },
        {
            field: "status",
            headerName: "Toggle to mark as paid",
            width: 200,
            renderCell: (params) => (
                <Switch
                    checked={params.row.status === "Paid"} // Check if the status is 'Paid'
                    disabled={params.row.status === "Paid"}
                    onChange={() => updatePayoutStatus(params.row.payout_id)} // Call update function
                    color="primary"
                />
            )
        },
    ];
    const { showToast } = useToastStore();
    const { post, put } = useApi(`${import.meta.env.VITE_API_URL}`);

    const fetchPayouts = async () => {
        try {
            const payouts = await post(`/payouts/fetch-payouts`, {});
            if (!payouts) throw new Error('Error fetching payouts');

            setPayouts(payouts.map((payout: Payout) => ({
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

    useEffect(() => {
        fetchPayouts();
    }, []);

    const updatePayoutStatus = async (payout_id: number) => {

        try {
            const updatedPayout = await put(`/payouts/update-payout`, { payout_id });
            if (!updatedPayout) throw new Error('Error updating payout request');

            fetchPayouts();
            showToast('Payout updated successfully', 'success');

        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    };

    return (

        <Box sx={{ height: 400, width: "100%" }}>
            <Typography variant="body1" fontSize={18} fontWeight={500} gutterBottom>
                Past Payouts
            </Typography>
            <DataGrid rows={payouts} columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 50 }
                    }
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                pagination />
        </Box>
    )
}

export default PayoutsRequests;