import { Box, IconButton, Popover, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";

const TransactionFeeInfo = ({ fee }: { fee: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'transaction-fee-popover' : undefined;

  return (
    <Box display="flex" justifyContent="space-between">
      <Typography fontSize={14} fontWeight={500} color="gray">
        Transaction fee ({import.meta.env.VITE_TRANSACTION_FEE}%){" "}
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2} maxWidth={250}>
            <Typography variant="body2">
              This fee helps us keep the platform running and cover payment processing costs.
            </Typography>
          </Box>
        </Popover>
      </Typography>
      <Typography fontSize={14} fontWeight={500} color="gray">R{fee}</Typography>
    </Box>
  );
};

export default TransactionFeeInfo;
