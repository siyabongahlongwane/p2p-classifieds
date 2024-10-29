import { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const Badge = ({
  count,
  Icon,
  onClick,
}: {
  count: number;
  Icon: SvgIconComponent;
  onClick?: () => void;
}) => {
  return (
    <Box
      className={onClick ? "pointer" : ""}
      position="relative"
      onClick={() => (onClick ? onClick() : null)}
    >
      <Icon htmlColor="gray" />
      <Box
        position={"absolute"}
        bottom={18}
        left={12}
        color={"#fff"}
        bgcolor={"var(--blue)"}
        p={0.6}
        borderRadius={"50%"}
        height={"20px"}
        width={"20px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography fontSize={10}> {count >= 100 ? "99+" : count}</Typography>
      </Box>
    </Box>
  );
};

export default Badge;
