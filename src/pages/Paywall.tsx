
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Lock, Shield, Zap, Nutrition, BookOpen, Image } from 'lucide-react';
import { toast } from 'sonner';

const Paywall = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Mock subscription API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would call a serverless function to handle Stripe checkout
      // After successful payment, the user object would be updated with subscription info
      
      toast.success('Subscription activated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTrialEnd = () => {
    if (!currentUser?.trialEnds) return '';
    
    const trialEnd = new Date(currentUser.trialEnds);
    const today = new Date();
    
    // Calculate days remaining
    const diffTime = trialEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Your trial has ended';
    } else if (diffDays === 1) {
      return 'Your trial ends tomorrow';
    } else {
      return `Your trial ends in ${diffDays} days`;
    }
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-full bg-muted mb-4">
              <Lock className="h-8 w-8 text-fit-blue" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Upgrade to FitVision Premium</h1>
            <p className="text-lg text-muted-foreground">
              {formatTrialEnd()}
            </p>
          </div>
          
          <Card className="mb-8 fitvision-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium Features</CardTitle>
              <CardDescription>All the tools you need for your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="shrink-0 p-2 rounded-full bg-muted">
                    {/* <Nutrition className="h-5 w-5 text-fit-blue" /> */}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Advanced Nutrition Tracking</h3>
                    <p className="text-sm text-muted-foreground">Track unlimited meals and get personalized recommendations</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 p-2 rounded-full bg-muted">
                    <Image className="h-5 w-5 text-fit-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Meal Image Analysis</h3>
                    <p className="text-sm text-muted-foreground">AI-powered nutritional breakdown of your meals</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 p-2 rounded-full bg-muted">
                    <Zap className="h-5 w-5 text-fit-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Personalized Feedback</h3>
                    <p className="text-sm text-muted-foreground">Get customized guidance based on your fitness goals</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 p-2 rounded-full bg-muted">
                    <BookOpen className="h-5 w-5 text-fit-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Progress Tracking</h3>
                    <p className="text-sm text-muted-foreground">Advanced metrics and historical data analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="fitvision-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Monthly</CardTitle>
                <CardDescription>Perfect for short-term goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-fit-green" />
                    <span className="text-sm">All premium features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-fit-green" />
                    <span className="text-sm">Cancel anytime</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Subscribe Monthly'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="relative fitvision-border border-fit-blue hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-fit-blue text-white text-xs py-1 px-3 rounded-full">
                BEST VALUE
              </div>
              <CardHeader>
                <CardTitle>Annual</CardTitle>
                <CardDescription>Save 40% with yearly billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">$69.99</span>
                  <span className="text-muted-foreground"> / year</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-fit-green" />
                    <span className="text-sm">All premium features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-fit-green" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-fit-green" />
                    <span className="text-sm">2 month free</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Subscribe Yearly'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Secure payment processing with SSL</span>
            </div>
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription anytime.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Paywall;
