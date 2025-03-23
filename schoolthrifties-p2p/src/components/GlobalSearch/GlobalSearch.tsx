import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, CircularProgress, Typography, Box, Divider, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Import useLocation to access URL parameters
import ProductItemGroup from '../Products/ProductItemGroup';
import { PlainProduct } from '../../typings';
import ProductItem from '../Products/ProductItem';

const GlobalSearch = () => {
    const location = useLocation(); // Get location object
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({
        products: [],
        shops: [],
    });
    const [loading, setLoading] = useState(false);

    // Fetch query from the URL when the component is mounted or when location changes
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParam = searchParams.get('query');
        if (queryParam) {
            setQuery(queryParam);  // Set query state from URL parameter
        }
    }, [location]); // Dependency on location ensures this runs whenever the location changes

    // Function to fetch data based on the query
    const handleSearch = async (query: string) => {
        if (query.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/search?query=${query}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setResults(data); // Set the search results
            } catch (error) {
                console.error('Error performing search:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setResults({
                products: [],
                shops: [],
            });
        }
    };

    // Trigger the search whenever the query state changes
    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]); // Re-run the search whenever the query changes

    return (
        <Box sx={{ padding: 2 }}>
            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}

            {query && !loading && (
                <Box>
                    <Typography variant="h6">Products</Typography>
                    <List>
                        {results.products.length > 0 ? (
                            results.products.map((product: PlainProduct, index: number) => (
                                <Box maxWidth={'205px'}>
                                    <ProductItem key={index} product={product} />
                                </Box>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No products found" />
                            </ListItem>
                        )}
                    </List>

                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Shops
                    </Typography>
                    <List>
                        {results.shops.length > 0 ? (
                            results?.shops?.map((shop: any, index: number) => (
                                <Box key={index} >
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
    );
};

export default GlobalSearch;
