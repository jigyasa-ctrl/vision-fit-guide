
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dumbbell, ArrowRight, Check, Image, Sparkles, Target } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is authenticated and has premium access, redirect to dashboard
    if (isAuthenticated && canAccessPremiumFeatures) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, canAccessPremiumFeatures, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-fit-blue mr-2" />
              <span className="font-bold text-2xl">FitVision</span>
            </div>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 px-4 bg-gradient-to-br from-fit-blue/10 to-fit-green/10">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Achieve Your Fitness Goals with AI-Powered Nutrition
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              FitVision helps you track your nutrition with advanced image recognition and personalized feedback.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/register">
                  Start 7-Day Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-16">How FitVision Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="rounded-full bg-fit-blue/10 p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-fit-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Set Your Goals</h3>
                <p className="text-muted-foreground">
                  Enter your details, fitness level, and goals. FitVision creates a personalized nutrition plan.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-fit-green/10 p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Image className="h-10 w-10 text-fit-green" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Snap Your Meals</h3>
                <p className="text-muted-foreground">
                  Take photos of your meals and FitVision's AI identifies what you're eating and its nutritional content.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-fit-indigo/10 p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-fit-indigo" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Get Feedback</h3>
                <p className="text-muted-foreground">
                  Receive instant analysis and personalized suggestions to help you stay on track with your goals.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Features Built to Help You Succeed</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-fit-green" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold mb-1">AI Meal Analysis</h3>
                      <p className="text-muted-foreground">
                        Upload photos of your meals and get instant nutritional breakdown and recommendations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-fit-green" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold mb-1">Personalized Meal Plans</h3>
                      <p className="text-muted-foreground">
                        Get customized macro calculations based on your body, goals, and activity level.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-fit-green" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold mb-1">Goal-Specific Guidance</h3>
                      <p className="text-muted-foreground">
                        Whether you're trying to lose fat, maintain, or gain muscle, FitVision adapts to your needs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-fit-green" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold mb-1">Progress Tracking</h3>
                      <p className="text-muted-foreground">
                        See trends and improvements over time with advanced analytics and progress monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-first lg:order-last">
                <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-fit-blue to-fit-green rounded-2xl shadow-xl overflow-hidden p-1">
                  <div className="bg-white rounded-xl h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <Dumbbell className="h-16 w-16 mx-auto mb-4 text-fit-blue" />
                      <h3 className="text-xl font-bold">FitVision Dashboard</h3>
                      <p className="text-muted-foreground mt-2">App interface visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 bg-gradient-to-br from-fit-blue to-fit-green text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Start Your Fitness Journey Today</h2>
            <p className="text-xl mb-10">
              Try FitVision free for 7 days. No credit card required.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-fit-blue text-lg px-8 py-6"
              asChild
            >
              <Link to="/register">
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <Dumbbell className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">FitVision</span>
            </div>
            
            <div className="flex space-x-6 mb-6 md:mb-0">
              <Link to="/" className="hover:text-fit-blue">Home</Link>
              <Link to="/features" className="hover:text-fit-blue">Features</Link>
              <Link to="/pricing" className="hover:text-fit-blue">Pricing</Link>
              <Link to="/about" className="hover:text-fit-blue">About</Link>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} FitVision. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
