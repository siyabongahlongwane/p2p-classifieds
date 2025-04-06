import { Box, Typography } from "@mui/material";

const OrderRow = ({
  label,
  value,
  bold = false
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <Box display="flex" justifyContent="space-between">
    <Typography fontSize={14} fontWeight={400} color="gray">{label}</Typography>
    <Typography
      fontSize={14}
      fontWeight={bold ? 600 : 500}
      color="gray"
    >
      {value}
    </Typography>
  </Box>
);

export default OrderRow;
