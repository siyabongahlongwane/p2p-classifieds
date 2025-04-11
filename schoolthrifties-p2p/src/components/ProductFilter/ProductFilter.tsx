import React from 'react';
import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
} from '@mui/material';
import { useStore } from '../../stores/store';

type FilterOptions = {
    shoe_size: string[];
    child_age: string[];
    gender: string[];
    category_id: string[];
    condition: string[];
    province: string[];
};

type Props = {
    filterOptions: FilterOptions;
    selectedFilters: Partial<FilterOptions>;
    onChange: (filters: Partial<FilterOptions>) => void;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const ProductFilter: React.FC<Props> = ({
    filterOptions,
    selectedFilters,
    onChange,
}) => {
    const { categories } = useStore();
    const handleChange = (key: keyof FilterOptions) => (event: any) => {
        const value = event.target.value;
        onChange({
            ...selectedFilters,
            [key]: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const renderSelect = (
        label: string,
        key: keyof FilterOptions,
        options: string[]
    ) => (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={selectedFilters[key] || []}
                onChange={handleChange(key)}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => (selected as string[]).join(', ')}
                MenuProps={MenuProps}
            >
                {options.map((option) => (
                    <MenuItem key = { option } value = { option } >
                        <Checkbox
                            checked={selectedFilters[key]?.includes(option) || false}
                        />
                        <ListItemText primary={key == 'category_id' ? categories.find((c) => c.category_id == +option)?.title : option} />
                    </MenuItem>
                ))}
        </Select>
        </FormControl >
    );

return (
    <Grid container spacing={2}>
        {
            filterOptions.shoe_size.length > 0 && (
                <Grid item xs={12}>
                    {renderSelect('Shoe Size', 'shoe_size', filterOptions.shoe_size)}
                </Grid>

            )
        }
        <Grid item xs={12}>
            {renderSelect('Child Age', 'child_age', filterOptions.child_age)}
        </Grid>
        <Grid item xs={12}>
            {renderSelect('Gender', 'gender', filterOptions.gender)}
        </Grid>
        <Grid item xs={12}>
            {renderSelect('Category', 'category_id', filterOptions.category_id)}
        </Grid>
        <Grid item xs={12}>
            {renderSelect('Condition', 'condition', filterOptions.condition)}
        </Grid>
        <Grid item xs={12}>
            {renderSelect('Province', 'province', filterOptions.province)}
        </Grid>
    </Grid>
);
};
