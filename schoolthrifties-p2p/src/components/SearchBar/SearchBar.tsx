import { Box, TextField } from "@mui/material";
import "./SearchBar.css";
import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const search = () => {
    if (!query.trim().length) {
      return
    } else {
      navigate(`/search?query=${query}`);
    }
  }

  return (
    <Box className="search-bar">
      <TextField
        error={false}
        placeholder="Search shops and products"
        fullWidth
        onChange={(e) => setQuery(e.target.value)}
        defaultValue={searchParams?.get('query')}
      />
      <SearchOutlined onClick={search} fontSize="small" className="icon" htmlColor="gray" />
    </Box>
  );
};

export default SearchBar;
