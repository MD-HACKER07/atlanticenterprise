import React from 'react';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  category: string;
  isNew?: boolean;
  inStock?: boolean;
}

interface ProductCardProps {
  product: ProductProps;
  layout?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { id, name, price, oldPrice, rating, image, category, isNew, inStock = true } = product;
  
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const renderStars = () => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
        <div className="w-1/3 relative">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover"
          />
          {isNew && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="w-2/3 p-6">
          <div className="mb-1">
            <span className="text-sm text-gray-500">{category}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
          <div className="mb-4">{renderStars()}</div>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
            {oldPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{oldPrice.toLocaleString()}</span>
            )}
          </div>
          <p className="text-gray-700 mb-4 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan, nunc vel pretium hendrerit, magna est aliquam lectus.
          </p>
          <div className="flex space-x-2">
            <button 
              className={`flex items-center px-4 py-2 rounded-lg ${
                inStock 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!inStock}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="flex items-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-red-500 hover:border-red-500">
              <Heart className="w-5 h-5" />
            </button>
            <Link 
              to={`/product/${id}`} 
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {isNew && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            NEW
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <button 
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 text-gray-600 hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-gray-500">{category}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{name}</h3>
        <div className="mb-2">{renderStars()}</div>
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
          {oldPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">₹{oldPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="flex space-x-1">
          <button 
            className={`flex items-center justify-center flex-1 px-3 py-2 rounded-lg ${
              inStock 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!inStock}
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            <span className="text-sm">{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
          <Link 
            to={`/product/${id}`} 
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 