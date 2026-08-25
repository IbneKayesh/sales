import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/?category=${category.id}`}
      className="category-card"
      aria-label={`Browse ${category.name} products`}
    >
      <div className="category-card-image-wrapper">
        <img
          src={category.image}
          alt={category.name}
          className="category-card-image"
          loading="lazy"
        />
      </div>
      <div className="category-card-content">
        <h3 className="category-card-name">{category.name}</h3>
        <p className="category-card-count">{category.productCount} products</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
