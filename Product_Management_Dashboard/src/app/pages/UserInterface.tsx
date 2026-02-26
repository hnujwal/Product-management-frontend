import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { mainApi, Product } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Heart, ShoppingBag, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function UserInterface() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingProducts, setLikingProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchProducts();
    
    // Set up polling for real-time likes counter (every 5 seconds)
    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const data = await mainApi.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products. Make sure the Flask service is running on port 8001.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeProduct = async (productId: number) => {
    // Prevent multiple simultaneous likes on the same product
    if (likingProducts.has(productId)) return;

    setLikingProducts(prev => new Set(prev).add(productId));

    try {
      // Optimistic update
      setProducts(products.map(p => 
        p.id === productId ? { ...p, links: p.links + 1 } : p
      ));

      await mainApi.likeProduct(productId);
      toast.success('Product liked!', {
        duration: 2000,
      });
    } catch (err) {
      // Revert optimistic update on error
      setProducts(products.map(p => 
        p.id === productId ? { ...p, links: p.links - 1 } : p
      ));
      toast.error('Failed to like product. Please try again.');
      console.error('Error:', err);
    } finally {
      setLikingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">Product Catalog</h1>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our curated collection and show your love by liking your favorite items.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Connection Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchProducts}
                className="mt-3"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-64 bg-gray-200 animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 mb-6">Check back later for new products.</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 bg-gray-100 group">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span className="text-sm font-medium">{product.links} likes</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleLikeProduct(product.id)}
                    disabled={likingProducts.has(product.id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                  >
                    <Heart className="h-4 w-4" />
                    {likingProducts.has(product.id) ? 'Liking...' : 'Like'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2026 Product Catalog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
