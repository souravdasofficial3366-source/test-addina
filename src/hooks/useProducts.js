import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { products as localProducts } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromDb() {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load DB products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFromDb();
  }, []);

  return { products, loading };
}
