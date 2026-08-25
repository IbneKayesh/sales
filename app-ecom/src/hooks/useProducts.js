import { useState, useMemo, useCallback, useEffect } from 'react';
import { products } from '@/data/products';

const ITEMS_PER_PAGE = 20;

const useProducts = (categoryFilter = null, searchQuery = null) => {
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState(categoryFilter || 'all');
  const [filterStock, setFilterStock] = useState('all'); // all, inStock, outOfStock
  const [filterRating, setFilterRating] = useState('all'); // all, 4+, 3+, 2+
  const [filterVendor, setFilterVendor] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Sync categoryFilter param
  useMemo(() => {
    if (categoryFilter) {
      setFilterCategory(categoryFilter);
    }
  }, [categoryFilter]);

  // Reset pagination when any filter changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filterCategory, filterStock, filterRating, filterVendor, appliedPriceMin, appliedPriceMax, sortBy, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filterCategory && filterCategory !== 'all') {
      result = result.filter(product => product.category === filterCategory);
    }

    // Filter by stock
    if (filterStock === 'inStock') {
      result = result.filter(product => product.stock > 10);
    } else if (filterStock === 'upcoming') {
      result = result.filter(product => product.stock > 0 && product.stock <= 10);
    } else if (filterStock === 'outOfStock') {
      result = result.filter(product => product.stock <= 0);
    }

    // Filter by rating
    if (filterRating === '4+') {
      result = result.filter(product => product.rating >= 4);
    } else if (filterRating === '3+') {
      result = result.filter(product => product.rating >= 3);
    } else if (filterRating === '2+') {
      result = result.filter(product => product.rating >= 2);
    }

    // Filter by price range
    const min = appliedPriceMin !== '' ? Number(appliedPriceMin) : 0;
    const max = appliedPriceMax !== '' ? Number(appliedPriceMax) : Infinity;
    if (appliedPriceMin !== '' || appliedPriceMax !== '') {
      result = result.filter(product => product.price >= min && product.price <= max);
    }

    // Filter by vendor
    if (filterVendor && filterVendor !== 'all') {
      result = result.filter(product => product.vendor_id === filterVendor);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'stock':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [filterCategory, filterStock, filterRating, filterVendor, appliedPriceMin, appliedPriceMax, sortBy, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  const hasMore = displayCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const resetPagination = useCallback(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, []);

  return {
    products: displayedProducts,
    allProducts: products,
    totalFiltered: filteredProducts.length,
    totalProducts: products.length,
    hasMore,
    loadMore,
    resetPagination,
    sortBy,
    setSortBy,
    filterCategory,
    setFilterCategory,
    filterStock,
    setFilterStock,
    filterRating,
    setFilterRating,
    filterVendor,
    setFilterVendor,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    appliedPriceMin, setAppliedPriceMin,
    appliedPriceMax, setAppliedPriceMax,
    ITEMS_PER_PAGE
  };
};

export default useProducts;
