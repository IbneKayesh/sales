import useCategories from '@/hooks/useCategories';
import CategoryCard from '@/components/category/CategoryCard';

const CategoryList = () => {
  const { categories } = useCategories();

  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="container">
        <h2 id="categories-title" className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
