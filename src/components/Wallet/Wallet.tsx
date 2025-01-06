import { useContext, useEffect, useState } from "react";
import useToastStore from "../../stores/useToastStore";
import useApi from "../../hooks/useApi";
import { UserContext } from "../../context/User/UserContext";
import { Box, Grid, Button } from "@mui/material";
import PageHeader from "../PageHeader/PageHeader";
import BankDetailsDialog, { BankingDetails } from "./BankDetailsDialog";
import PastPayouts from "./PastPayouts";

const Wallet = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const { showToast } = useToastStore();
  const { post, get } = useApi(`${import.meta.env.VITE_API_URL}`);
  const { user: { user_id } } = useContext(UserContext);

  const handleRequestPayout = async (bankingDetails: BankingDetails) => {
    setDialogOpen(false);

    try {
      const payout = await post(`/payouts/create-payout`, { user_id, ...bankingDetails });
      setAmount(payout.amount);

    } catch (error) {
      showToast('Error creating payout', 'error');
      console.error("Error creating payout:", error);
      return;
    }
  };




  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const wallet = await get(`/wallet/fetch-wallet?user_id=${user_id}`);
        setAmount(wallet.amount)

      } catch (error) {
        showToast('Error fetching wallet', 'error');
        console.error("Error fetching wallet:", error);
        return;
      }
    }

    fetchWallet();
  }, [user_id]);

  return (
    <Box>
      <PageHeader header="My Wallet" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <PageHeader header={`Balance: R${amount ?? 0}`} />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(true)}
          >
            Request Payout
          </Button>
        </Grid>
      </Grid>

      <BankDetailsDialog setDialogOpen={setDialogOpen} handleRequestPayout={handleRequestPayout} dialogOpen={dialogOpen} />
      <PastPayouts user_id={user_id} />
    </Box>
  );
};

export default Wallet;
