import { GuestLayout } from "@/layouts/GuestLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Target, 
  Users, 
  Award, 
  Zap, 
  Heart,
  Building2,
  Globe,
  TrendingUp 
} from "lucide-react";

export default function About() {
  return (
    <GuestLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-purple-50 text-purple-700 hover:bg-purple-100">
              About PromoEngine
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Revolutionizing Promotional
              <span className="block text-purple-600">Marketing</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              We're building the future of intelligent promotional campaigns, 
              helping businesses boost sales by 300% through AI-powered marketing automation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-8">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  To empower businesses of all sizes with intelligent promotional tools 
                  that drive growth, increase customer engagement, and deliver measurable results.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="font-bold text-gray-900">Precision</div>
                      <div className="text-sm text-gray-600">Targeted campaigns</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-bold text-gray-900">Speed</div>
                      <div className="text-sm text-gray-600">Quick deployment</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                    <div>
                      <div className="font-bold text-gray-900">Growth</div>
                      <div className="text-sm text-gray-600">Proven results</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-8 w-8 text-pink-600" />
                    <div>
                      <div className="font-bold text-gray-900">Care</div>
                      <div className="text-sm text-gray-600">Customer success</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-12 shadow-xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Impact</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-4xl font-black text-purple-600 mb-2">10K+</div>
                      <div className="text-sm text-gray-600">Happy Customers</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-blue-600 mb-2">300%</div>
                      <div className="text-sm text-gray-600">Sales Increase</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-emerald-600 mb-2">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-pink-600 mb-2">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-8">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Building2 className="h-12 w-12 text-purple-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries to deliver cutting-edge solutions 
                that drive real business results.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make is centered around delivering 
                exceptional value to our customers.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Globe className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Impact</h3>
              <p className="text-gray-600">
                We're building solutions that help businesses worldwide 
                achieve their growth objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

    </GuestLayout>
  );
}