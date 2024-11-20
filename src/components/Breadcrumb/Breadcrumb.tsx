import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Breadcrumb = ({ crumbs, activeCrumb, fontSize }: { crumbs: Array<{ title: string, route: string }>, activeCrumb: number, fontSize: number }) => {
    const navigate = useNavigate();
    return (
        <Box display={"flex"} alignItems={"center"} mb={2} gap={3}>
            {
                crumbs.map((crumb, index) => {
                    return <Box display={"flex"} alignItems={"center"} gap={2} key={index} className='pointer' onClick={() => navigate(crumb.route)} >
                        <Typography fontWeight={(index === activeCrumb) ? 600 : 300} variant="h1" fontSize={fontSize}>
                            {crumb.title}

                        </Typography>
                        {index !== crumbs.length - 1 && <Box height={3} width={'3vw'} bgcolor={'var(--blue)'}></Box>}
                    </Box>
                })
            }
        </Box>
    );
};

export default Breadcrumb;
