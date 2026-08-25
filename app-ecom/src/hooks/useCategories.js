import { useMemo } from 'react';
import { categories } from '@/data/categories';
import { products } from '@/data/products';

const useCategories = () => {
  const categoriesWithCount = useMemo(() => {
    return categories.map(category => ({
      ...category,
      productCount: products.filter(p => p.category === category.id).length
    }));
  }, []);

  return {
    categories: categoriesWithCount,
    totalCategories: categories.length
  };
};

export default useCategories;
