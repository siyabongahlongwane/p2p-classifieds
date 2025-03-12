import { Box, TextField } from "@mui/material";
import "./SearchBar.css";
import { SearchOutlined } from "@mui/icons-material";
const SearchBar = () => {
  return (
    <Box className="search-bar">
      <TextField
        error={false}
        placeholder="Search shops and products"
        helperText=""
        fullWidth
      />
      <SearchOutlined fontSize="small" className="icon" htmlColor="gray" />
    </Box>
  );
};

export default SearchBar;
