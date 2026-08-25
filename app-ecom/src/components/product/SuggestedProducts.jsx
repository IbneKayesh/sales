import ProductCard from '@/components/product/ProductCard';

const SuggestedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="section suggested-products" aria-labelledby="suggested-title">
      <div className="container">
        <h2 id="suggested-title" className="section-title">You May Also Like</h2>
        <div className="suggested-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedProducts;
