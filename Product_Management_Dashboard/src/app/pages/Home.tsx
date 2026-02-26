import React from 'react';
import { Link } from 'react-router';
import { ShieldCheck, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-bold text-gray-900 mb-4">
            Product Management System
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A microservices-based application with separate admin and user interfaces.
            Currently running with mock data for demo purposes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Card */}
          <Link
            to="/admin"
            className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-200 transition-colors">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-gray-900 mb-3">Admin Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Manage your product catalog. Create, update, and delete products.
              Monitor likes and engagement in real-time.
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span>Go to Admin</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Django Service</span> • Port 8000
              </p>
            </div>
          </Link>

          {/* User Card */}
          <Link
            to="/catalog"
            className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 group-hover:bg-purple-200 transition-colors">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-gray-900 mb-3">Product Catalog</h2>
            <p className="text-gray-600 mb-6">
              Browse the product catalog and show your appreciation by liking
              your favorite products. Real-time updates every 5 seconds.
            </p>
            <div className="flex items-center text-purple-600 group-hover:text-purple-700">
              <span>Browse Products</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Flask Service</span> • Port 8001
              </p>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-gray-900 mb-4">Architecture Overview</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Admin Service:</strong> Django backend on port 8000 handles all CRUD operations for product management</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <p><strong>Main Service:</strong> Flask backend on port 8001 provides user-facing product catalog and like functionality</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Frontend:</strong> React application with routing, real-time updates, and responsive design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}