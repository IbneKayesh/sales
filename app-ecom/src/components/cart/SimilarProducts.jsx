import ProductCard from '@/components/product/ProductCard';

const SimilarProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="section similar-products" aria-labelledby="similar-title">
      <div className="container">
        <h2 id="similar-title" className="section-title">You May Also Like</h2>
        <div className="similar-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProducts;
