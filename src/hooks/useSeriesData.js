import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { SERIES_CONFIG } from '../config/menuConfig';

const useSeriesData = (shouldFetch) => {
    const [dbItems, setDbItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shouldFetch) {
            setDbItems([]);
            return;
        }

        const fetchSeriesData = async () => {
            setLoading(true);
            try {
                // Fetch all bikes to find distinct series
                const { data: bikes, error: fetchError } = await supabase
                    .from('bicicletas')
                    .select('serie_id, imagenes_urls');

                if (fetchError) {
                    console.error('Error fetching series data:', fetchError);
                    setError(fetchError);
                    return;
                }

                // Group by serie_id and pick the first image for each
                const seriesFound = {};
                bikes.forEach(bike => {
                    if (bike.serie_id && !seriesFound[bike.serie_id]) {
                        seriesFound[bike.serie_id] = bike.imagenes_urls?.[0];
                    }
                });

                // Construct menu items based on found series
                const newItems = Object.keys(seriesFound).map(serieId => {
                    const config = SERIES_CONFIG[serieId];
                    if (!config) return null; // Skip unknown series IDs

                    return {
                        ...config,
                        image: seriesFound[serieId]
                    };
                }).filter(Boolean); // Remove nulls

                // Sort by original config order (1-5)
                newItems.sort((a, b) => {
                    const idA = Object.keys(SERIES_CONFIG).find(key => SERIES_CONFIG[key].id === a.id);
                    const idB = Object.keys(SERIES_CONFIG).find(key => SERIES_CONFIG[key].id === b.id);
                    return Number(idA) - Number(idB);
                });

                setDbItems(newItems);
            } catch (err) {
                console.error('Failed to build dynamic menu', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeriesData();
    }, [shouldFetch]);

    return { dbItems, loading, error };
};

export default useSeriesData;
