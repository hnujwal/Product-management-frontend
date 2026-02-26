import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle, RefreshCw } from 'lucide-react';
import { mainAPI, Product } from '../services/api';

export default function UserCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingProduct, setLikingProduct] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    // Auto-refresh every 5 seconds to show real-time likes
    const interval = setInterval(loadProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      const data = await mainAPI.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Make sure the Flask server is running on port 8001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (productId: number) => {
    setLikingProduct(productId);
    try {
      const updatedProduct = await mainAPI.likeProduct(productId);
      // Update the product in the list
      setProducts(prev =>
        prev.map(p => (p.id === productId ? updatedProduct : p))
      );
    } catch (err) {
      alert('Failed to like product');
      console.error(err);
    } finally {
      setLikingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 mt-2">Discover and like amazing products</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              <span>Auto-refreshing every 5 seconds</span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadProducts}
                className="text-red-600 hover:text-red-700 underline mt-2"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {/* Like Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span className="text-gray-900">{product.likes}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-gray-900 mb-4 line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(product.id)}
                    disabled={likingProduct === product.id}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {likingProduct === product.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Liking...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        <span>Like This Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}