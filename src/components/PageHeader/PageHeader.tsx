import { Typography } from "@mui/material";

const PageHeader = ({ header }: { header: string }) => {
  return (
    <Typography fontWeight={"300"} variant="h1" fontSize={20} mb={2}>
      {header}
    </Typography>
  );
};

export default PageHeader;
