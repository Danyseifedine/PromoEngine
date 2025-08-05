import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Users, Sparkles, TrendingUp, Target, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GuestLayout } from "@/layouts/GuestLayout";

function Landing() {
  return (
    <GuestLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm mb-12 hover:shadow-md hover:bg-white/90 transition-all duration-500 group">
              <Sparkles className="mr-2 h-4 w-4 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-semibold text-gray-800">New: AI-Powered Rule Engine</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 mb-12 leading-none">
              <span className="block mb-4">Smart Promotion</span>
              <span className="block text-purple-600">Revolution</span>
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto font-medium">
              🚀 Transform your business with intelligent promotional campaigns. 
              <span className="text-purple-600 font-semibold"> Boost sales by 300%</span>, 
              engage customers like never before, and drive exponential growth.
            </p>
            
            <div className="mt-16 flex flex-col items-center justify-center gap-6">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group" asChild>
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">⭐⭐⭐⭐⭐</div>
                  <span className="font-medium text-gray-700">4.9/5 from 2,000+ reviews</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-gray-600">Trusted by 10,000+ businesses worldwide</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 hover:bg-white/80 hover:-translate-y-2 hover:rotate-1 transition-all duration-500 hover:shadow-lg">
                  <div className="text-4xl font-black text-purple-600 mb-2">300%</div>
                  <div className="text-sm text-gray-600 font-semibold">Sales Boost</div>
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 hover:bg-white/80 hover:-translate-y-2 hover:-rotate-1 transition-all duration-500 hover:shadow-lg delay-75">
                  <div className="text-4xl font-black text-blue-600 mb-2">10K+</div>
                  <div className="text-sm text-gray-600 font-semibold">Happy Customers</div>
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 hover:bg-white/80 hover:-translate-y-2 hover:rotate-1 transition-all duration-500 hover:shadow-lg delay-150">
                  <div className="text-4xl font-black text-emerald-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600 font-semibold">Uptime</div>
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 hover:bg-white/80 hover:-translate-y-2 hover:-rotate-1 transition-all duration-500 hover:shadow-lg delay-200">
                  <div className="text-4xl font-black text-indigo-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600 font-semibold">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50/50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.03),transparent)] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm mb-8 hover:shadow-md hover:bg-white/90 transition-all duration-500 group">
              <Rocket className="mr-2 h-4 w-4 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-semibold text-gray-800">Why Leading Brands Choose Us</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Transform Your Business<br />
              <span className="text-purple-600">Revenue Engine</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the power of intelligent promotions that adapt, learn, and grow with your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-700 cursor-pointer">
              <div className="w-20 h-20 bg-purple-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-100/80 transition-all duration-500">
                <Zap className="h-10 w-10 text-purple-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-purple-700 transition-colors duration-500">
                Smart Rule Engine
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Create complex promotional rules with our intuitive interface. 
                <span className="font-semibold text-purple-600"> AI-powered suggestions</span> make setup effortless.
              </p>
              <div className="flex items-center text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore feature</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:-rotate-1 transition-all duration-700 cursor-pointer delay-75">
              <div className="w-20 h-20 bg-blue-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-500">
                <BarChart3 className="h-10 w-10 text-blue-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-blue-700 transition-colors duration-500">
                Real-time Analytics
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Track promotion performance instantly. Get 
                <span className="font-semibold text-blue-600"> detailed insights</span> on ROI, engagement, and conversion rates.
              </p>
              <div className="flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore feature</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-700 cursor-pointer delay-150">
              <div className="w-20 h-20 bg-emerald-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-100/80 transition-all duration-500">
                <Target className="h-10 w-10 text-emerald-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-emerald-700 transition-colors duration-500">
                Smart Targeting
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Target customer groups with 
                <span className="font-semibold text-emerald-600"> AI-powered segmentation</span>. 
                Boost conversion rates by 300%.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore feature</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:-rotate-1 transition-all duration-700 cursor-pointer delay-200">
              <div className="w-20 h-20 bg-orange-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-100/80 transition-all duration-500">
                <Shield className="h-10 w-10 text-orange-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-orange-700 transition-colors duration-500">
                Enterprise Security
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Built-in 
                <span className="font-semibold text-orange-600"> enterprise-grade security</span> prevents fraud 
                and protects your business.
              </p>
              <div className="flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore feature</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-700 cursor-pointer delay-300">
              <div className="w-20 h-20 bg-pink-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-pink-100/80 transition-all duration-500">
                <TrendingUp className="h-10 w-10 text-pink-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-pink-700 transition-colors duration-500">
                Lightning Performance
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                <span className="font-semibold text-pink-600"> Sub-100ms processing</span> ensures seamless experience 
                during high-traffic periods.
              </p>
              <div className="flex items-center text-pink-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore feature</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:-rotate-1 transition-all duration-700 cursor-pointer delay-400">
              <div className="w-20 h-20 bg-indigo-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-100/80 transition-all duration-500">
                <Rocket className="h-10 w-10 text-indigo-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-indigo-700 transition-colors duration-500">
                Quick Integration
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                <span className="font-semibold text-indigo-600"> 5-minute setup</span> with any platform. 
                REST API, webhooks, and connectors included.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore feature</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Refined Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-12 hover:bg-white/15 transition-all duration-500 group">
              <Sparkles className="mr-3 h-5 w-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-sm font-semibold text-white">Limited Time: Start Your Success Story Today</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black mb-12 leading-tight">
              Ready to Transform<br />
              <span className="text-purple-400">Your Business?</span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Join <span className="font-bold text-purple-400">10,000+</span> businesses that transformed their revenue 
              with intelligent promotions. <span className="font-bold text-emerald-400">Start your journey today.</span>
            </p>
            
            {/* Refined CTA */}
            <div className="flex flex-col items-center gap-8 mb-20">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-16 py-8 text-2xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group border border-purple-500/50" 
                asChild
              >
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              
              <div className="flex flex-col sm:flex-row items-center gap-8 text-gray-400">
                <span className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  No Credit Card Required
                </span>
                <span className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  14-Day Money Back Guarantee
                </span>
                <span className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Setup in 5 Minutes
                </span>
              </div>
            </div>
            
            {/* Refined Social Proof */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 hover:bg-white/10 transition-all duration-700 group">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="flex justify-center md:justify-start items-center mb-4">
                    <div className="flex -space-x-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-full border-3 border-white flex items-center justify-center text-white font-bold">J</div>
                      <div className="w-12 h-12 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center text-white font-bold">M</div>
                      <div className="w-12 h-12 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center text-white font-bold">S</div>
                      <div className="w-12 h-12 bg-orange-500 rounded-full border-3 border-white flex items-center justify-center text-white font-bold text-sm">+1K</div>
                    </div>
                  </div>
                  <p className="text-white font-semibold text-lg">1,000+ new customers this week</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center items-center text-yellow-400 mb-2">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <p className="text-white font-semibold">4.9/5 from 2,000+ reviews</p>
                  <p className="text-gray-400 text-sm">on Trustpilot & G2</p>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-4xl font-black text-white mb-2">$2.4M+</p>
                  <p className="text-gray-400">Additional revenue generated</p>
                  <p className="text-gray-400 text-sm">this month alone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}

export default Landing;
