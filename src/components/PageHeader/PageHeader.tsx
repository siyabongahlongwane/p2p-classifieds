import { Typography } from "@mui/material";

const PageHeader = ({ header, fontWeight = 300, fontSize = 20 }: { header: string, fontWeight?: number, fontSize?: number }) => {
  return (
    <Typography fontWeight={fontWeight} variant="h1" fontSize={fontSize} mb={2}>
      {header}
    </Typography>
  );
};

export default PageHeader;
