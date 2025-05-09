import { useEffect, useState } from "react";
import useToastStore from "../../stores/useToastStore";
import useApi from "../../hooks/useApi";
import { useUserStore } from '../../stores/useUserStore';
import { Box, Grid, Button, Typography } from "@mui/material";
import PageHeader from "../PageHeader/PageHeader";
import BankDetailsDialog from "./BankDetailsDialog";
import PastPayouts from "./PastPayouts";
import { IBankingDetails } from "../../typings/Banking.int";

const Wallet = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const { showToast } = useToastStore();
  const { post, get } = useApi(`${import.meta.env.VITE_API_URL}`);
  const user = useUserStore((state) => state.user);

  const [fetchPayouts, setFetchPayouts] = useState(false);

  const handleRequestPayout = async (bankingDetails: IBankingDetails) => {
    setDialogOpen(false);

    try {
      const payout = await post(`/payouts/create-payout`, { user_id: user?.user_id, ...bankingDetails });
      if (!payout) throw new Error('Error requesting payout');

      setAmount(payout.amount);
      showToast('Payout requested successfully', 'success');
      setFetchPayouts(true);

    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(`Error creating payout: ${_error}`, 'error', 5000);
      console.error('error', _error);
      return;
    }
  };




  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const wallet = await get(`/wallet/fetch-wallet`);
        if (!wallet) throw new Error('Error fetching wallet');

        setAmount(wallet.amount)

      } catch (error) {
        const _error = error instanceof Error ? error.message : error;
        showToast(`Error fetching wallet: ${_error}`, 'error', 5000);
        console.error('error', _error);
        return;
      }
    }

    if (user?.user_id) fetchWallet();
  }, [user?.user_id]);

  return (
    <Box>
      <PageHeader header="My Wallet" />


      {
        !user?.user_id
          ?
          <Typography fontSize={16} fontWeight={300}>
            Please login to view your Wallet
          </Typography>
          :
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <PageHeader header={`Balance: R${amount ?? 0}`} />
              </Grid>
              <Grid item xs={12} sm={6} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setDialogOpen(true)}
                  disabled={+amount == 0}
                >
                  Request Payout
                </Button>
              </Grid>
            </Grid>

            <BankDetailsDialog setDialogOpen={setDialogOpen} handleRequestPayout={handleRequestPayout} dialogOpen={dialogOpen} />
            <PastPayouts user_id={user?.user_id} fetchPayouts={fetchPayouts} />
          </>
      }

    </Box>
  );
};

export default Wallet;
