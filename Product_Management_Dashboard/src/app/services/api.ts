import axios from 'axios';

// API Base URLs
// If services are in Docker, use the container names or host.docker.internal
// For accessing from host machine (browser), use localhost with mapped ports
const ADMIN_API = 'http://localhost:8000/api/products';
const MAIN_API = 'http://localhost:8001/api/products';

// Helper function for fetch requests
const fetchJSON = async (url: string, options: RequestInit = {}) => {
  console.log(`📤 ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    mode: 'cors',
  });

  console.log(`✅ ${response.status} ${url}`);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error response:', error);
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return response.json();
};

export interface Product {
  id: number;
  title: string;
  image: string;
  likes: number;
}

export interface CreateProductData {
  title: string;
  image: string;
}

// Mock data storage using localStorage
const STORAGE_KEY = 'products_data';

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default mock products
  return [
    {
      id: 1,
      title: 'Wireless Bluetooth Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      likes: 42
    },
    {
      id: 2,
      title: 'Smart Watch Series 5',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      likes: 38
    },
    {
      id: 3,
      title: 'Premium Coffee Maker',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
      likes: 25
    }
  ];
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API that simulates backend behavior
const useMockAPI = false // Set to false to use real backends

// Admin Service API (Django - Port 8000)
export const adminAPI = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    if (useMockAPI) {
      await delay();
      return getStoredProducts();
    }
    return fetchJSON(ADMIN_API);
  },

  // Create a new product
  createProduct: async (data: CreateProductData): Promise<Product> => {
    if (useMockAPI) {
      await delay();
      const products = getStoredProducts();
      const newProduct: Product = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        title: data.title,
        image: data.image,
        likes: 0
      };
      products.push(newProduct);
      saveProducts(products);
      return newProduct;
    }
    return fetchJSON(ADMIN_API, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a product
  updateProduct: async (id: number, data: Partial<CreateProductData>): Promise<Product> => {
    if (useMockAPI) {
      await delay();
      const products = getStoredProducts();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      
      products[index] = { ...products[index], ...data };
      saveProducts(products);
      return products[index];
    }
    return fetchJSON(`${ADMIN_API}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a product
  deleteProduct: async (id: number): Promise<void> => {
    if (useMockAPI) {
      await delay();
      const products = getStoredProducts();
      const filtered = products.filter(p => p.id !== id);
      saveProducts(filtered);
      return;
    }
    await fetchJSON(`${ADMIN_API}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Main Service API (Flask - Port 8001)
export const mainAPI = {
  // Get all products for users
  getProducts: async (): Promise<Product[]> => {
    if (useMockAPI) {
      await delay(300);
      return getStoredProducts();
    }
    return fetchJSON(MAIN_API);
  },

  // Like a product
  likeProduct: async (id: number): Promise<Product> => {
    if (useMockAPI) {
      await delay(300);
      const products = getStoredProducts();
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      
      product.likes += 1;
      saveProducts(products);
      return product;
    }
    return fetchJSON(`${MAIN_API}/${id}/like`, {
      method: 'POST',
    });
  },
};