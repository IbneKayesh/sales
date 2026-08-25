import { useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Carousel from '@/components/common/Carousel';
import CategoryBar from '@/components/category/CategoryBar';
import FilterSidebar from '@/components/common/FilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import useProducts from '@/hooks/useProducts';
import useCategories from '@/hooks/useCategories';

const Home = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const { categories } = useCategories();

  const {
    products,
    totalFiltered,
    totalProducts,
    hasMore,
    loadMore,
    sortBy, setSortBy,
    filterCategory, setFilterCategory,
    filterStock, setFilterStock,
    filterRating, setFilterRating,
    filterVendor, setFilterVendor,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    appliedPriceMin, appliedPriceMax,
    setAppliedPriceMin, setAppliedPriceMax
  } = useProducts(categoryParam, searchQuery);

  const handleApplyPrice = useCallback((min, max) => {
    setAppliedPriceMin(min);
    setAppliedPriceMax(max);
  }, [setAppliedPriceMin, setAppliedPriceMax]);

  const activeCategory = useMemo(() => {
    if (!filterCategory || filterCategory === 'all') return null;
    return categories.find(c => c.id === filterCategory);
  }, [filterCategory, categories]);

  const title = searchQuery
    ? `Search: "${searchQuery}"`
    : activeCategory ? `${activeCategory.name} Products` : 'All Products';

  const suggestedProducts = useMemo(() => {
    if (totalFiltered > 0) return null;
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [totalFiltered, products]);

  useEffect(() => {
    if (searchQuery) {
      document.title = `Search: ${searchQuery} | ShopEasy`;
    } else if (activeCategory) {
      document.title = `${activeCategory.name} Products | ShopEasy`;
    } else {
      document.title = 'ShopEasy - Online Shopping for Electronics, Clothing, Home & More';
    }
  }, [searchQuery, activeCategory]);

  return (
    <main>
      {!filterCategory || filterCategory === 'all' ? <Carousel /> : null}

      <CategoryBar />

      <div className="home-layout">
        <FilterSidebar
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStock={filterStock}
          setFilterStock={setFilterStock}
          filterRating={filterRating}
          setFilterRating={setFilterRating}
          filterVendor={filterVendor}
          setFilterVendor={setFilterVendor}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          appliedPriceMin={appliedPriceMin}
          appliedPriceMax={appliedPriceMax}
          onApplyPrice={handleApplyPrice}
          totalFiltered={totalFiltered}
          totalProducts={totalProducts}
        />

        <div className="home-products">
          <ProductGrid
            products={products}
            title={title}
            hasMore={hasMore}
            onLoadMore={loadMore}
            totalFiltered={totalFiltered}
            suggestedProducts={suggestedProducts}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
