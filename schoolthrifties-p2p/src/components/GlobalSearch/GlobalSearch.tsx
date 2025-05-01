import { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import ProductItemGroup from '../Products/ProductItemGroup';
import { PlainProduct } from '../../typings';
import ProductItem from '../Products/ProductItem';
import { ProductFilter } from '../ProductFilter/ProductFilter';
import PageHeader from '../PageHeader/PageHeader';


const GlobalSearch = () => {
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({
        products: [],
        shops: [],
    });
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        shoe_size: [],
        child_age: [],
        gender: [],
        category_id: [],
        condition: [],
        province: [],
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParam = searchParams.get('query');
        if (queryParam) setQuery(queryParam);
    }, [location]);

    const handleSearch = async (query: string) => {
        if (query.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/search?query=${query}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error performing search:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setResults({ products: [], shops: [] });
        }
    };

    useEffect(() => {
        if (query) handleSearch(query);
    }, [query]);

    const filteredProducts = results.products.filter((product: PlainProduct) => {
        const matches = (key: keyof typeof filters) =>
            filters[key].length === 0 || filters[key].includes(product[key]);

        return (
            matches('shoe_size') &&
            matches('child_age') &&
            matches('gender') &&
            matches('category_id') &&
            matches('condition') &&
            matches('province')
        );
    });

    const filterOptions = {
        shoe_size: [...new Set(results.products.map((p: any) => p.shoe_size).filter(Boolean))],
        child_age: [...new Set(results.products.map((p: any) => p.child_age).filter(Boolean))],
        gender: [...new Set(results.products.map((p: any) => p?.gender).filter(Boolean))],
        category_id: [...new Set(results.products.map((p: any) => p.category_id).filter(Boolean))],
        condition: [...new Set(results.products.map((p: any) => p.condition).filter(Boolean))],
        province: [...new Set(results.products.map((p: any) => p.province).filter(Boolean))],
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box display={'flex'} gap={2} mb={2}>
                <PageHeader header='Global Search' />
                {
                    (query && !loading) && (<Typography variant="h6" fontSize={14} mb={2} color='gray'>
                     (Refine your search with the filters)
                    </Typography>)
                }
            </Box>
            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
            <Box display={'grid'} gridTemplateColumns={'1fr 4fr'} gap={2}>
                {query && !loading && (
                    <ProductFilter
                        filterOptions={filterOptions}
                        selectedFilters={filters}
                        onChange={setFilters}
                    />
                )}
                {query && !loading && (
                    <Box>
                       <PageHeader header="Products" />
                        <List sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product: PlainProduct, index: number) => (
                                    <Box key={index} maxWidth={'205px'}>
                                        <ProductItem product={product} />
                                    </Box>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No products found" />
                                </ListItem>
                            )}
                        </List>

                        <PageHeader header="Shop" />

                        <List>
                            {results.shops.length > 0 ? (
                                results.shops.map((shop: any, index: number) => (
                                    <Box key={index}>
                                        <ProductItemGroup shop={shop} productsToShow={shop?.products?.length} />
                                        <Divider />
                                    </Box>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No shops found" />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                )}
            </Box>
        </Box>

    );
};

export default GlobalSearch;
