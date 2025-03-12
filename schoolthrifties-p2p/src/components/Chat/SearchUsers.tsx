import { useState, useEffect } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";

const SearchUsers = () => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;
        let users: any = [];
        // if (inputValue === "") {
        //     setOptions([]);
        //     return undefined;
        // }

        setLoading(true);
        (async () => {
            fetch('https://dummyjson.com/users')
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    users = res.users;
                    setOptions(users || []);
                });
            // const response = await fetch(`/users/search?query=${inputValue}`);
            if (active) {
                setOptions(users || []);
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputValue]);

    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionLabel={(option: any) =>
                `${option.firstName} ${option.lastName}`
            }
            options={options}
            loading={loading}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            isOptionEqualToValue={(option, value) =>
                option.user_id === value.user_id
            }
            renderOption={(props, option: any) => (
                <li {...props} key={Math.random()}>
                    {option.firstName} {option.lastName}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default SearchUsers;

