
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserProfile } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMealPlan } from '../lib/fitnessCalculator';

const UserSetupForm: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: 30,
    gender: 'male',
    height: 175,
    weight: 70,
    bodyFatPercentage: undefined,
    fitnessGoal: 'maintenance',
    activityLevel: 'moderate',
    stepsPerDay: 8000,
    workoutIntensity: 'medium'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNumberInput = (field: keyof UserProfile, value: string) => {
    const numberValue = value ? parseFloat(value) : 0;
    handleChange(field, numberValue);
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Create a complete UserProfile object
      const profile = formData as UserProfile;
      
      // Generate meal plan with macros
      const mealPlan = generateMealPlan(profile);
      
      // Add meal plan to profile
      const completeProfile: UserProfile = {
        ...profile,
        dailyCalories: mealPlan.dailyCalories,
        dailyProtein: mealPlan.dailyProtein,
        dailyCarbs: mealPlan.dailyCarbs,
        dailyFat: mealPlan.dailyFat,
        meals: {
          breakfast: mealPlan.breakfast,
          lunch: mealPlan.lunch,
          dinner: mealPlan.dinner,
          snack: mealPlan.snack
        }
      };
      
      // Update the user profile
      await updateUserProfile(completeProfile);
      
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting up profile:', error);
      toast.error('Failed to set up your profile.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const steps = [
    {
      title: 'Basic Information',
      description: 'Let\'s start with your basic stats'
    },
    {
      title: 'Fitness Details',
      description: 'Tell us about your activity level'
    },
    {
      title: 'Goals',
      description: 'What are you trying to achieve?'
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <Card className="w-full max-w-xl mx-auto fitvision-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Set Up Your Profile</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </div>
          <div className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-fit-blue h-2 rounded-full transition-all" 
            style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
          ></div>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input 
                id="age" 
                type="number"
                min="15"
                max="100"
                value={formData.age}
                onChange={(e) => handleNumberInput('age', e.target.value)}
                className="input-number-no-arrows"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gender</Label>
              <Tabs 
                defaultValue={formData.gender} 
                className="w-full"
                onValueChange={(value: 'male' | 'female') => handleChange('gender', value)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="male">Male</TabsTrigger>
                  <TabsTrigger value="female">Female</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => handleNumberInput('height', e.target.value)}
                className="input-number-no-arrows"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number"
                min="30"
                max="300"
                value={formData.weight}
                onChange={(e) => handleNumberInput('weight', e.target.value)}
                className="input-number-no-arrows"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
              <Input 
                id="bodyFat" 
                type="number"
                min="3"
                max="50"
                value={formData.bodyFatPercentage || ''}
                onChange={(e) => handleNumberInput('bodyFatPercentage', e.target.value)}
                placeholder="Enter if you know it"
                className="input-number-no-arrows"
              />
              <p className="text-xs text-muted-foreground">
                Including your body fat % will make calorie calculations more accurate
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select 
                value={formData.activityLevel}
                onValueChange={(value: UserProfile['activityLevel']) => handleChange('activityLevel', value)}
              >
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                  <SelectItem value="very active">Very Active (2x per day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stepsPerDay">Average Steps Per Day</Label>
              <Input 
                id="stepsPerDay" 
                type="number"
                min="1000"
                max="30000"
                value={formData.stepsPerDay}
                onChange={(e) => handleNumberInput('stepsPerDay', e.target.value)}
                className="input-number-no-arrows"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workoutIntensity">Workout Intensity</Label>
              <Select 
                value={formData.workoutIntensity}
                onValueChange={(value: UserProfile['workoutIntensity']) => handleChange('workoutIntensity', value)}
              >
                <SelectTrigger id="workoutIntensity">
                  <SelectValue placeholder="Select workout intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (light effort, rarely break a sweat)</SelectItem>
                  <SelectItem value="medium">Medium (moderate effort, sometimes sweating)</SelectItem>
                  <SelectItem value="high">High (high effort, always sweating)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What is your primary fitness goal?</Label>
              <Tabs 
                defaultValue={formData.fitnessGoal} 
                className="w-full"
                onValueChange={(value: UserProfile['fitnessGoal']) => handleChange('fitnessGoal', value)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="fat loss">Fat Loss</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="gain">Muscle Gain</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">
                  {formData.fitnessGoal === 'fat loss' && 'Fat Loss Plan'}
                  {formData.fitnessGoal === 'maintenance' && 'Maintenance Plan'}
                  {formData.fitnessGoal === 'gain' && 'Muscle Gain Plan'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.fitnessGoal === 'fat loss' && 'We\'ll create a moderate caloric deficit to help you lose fat while preserving muscle mass. Focus will be on higher protein intake and strategic meal timing.'}
                  {formData.fitnessGoal === 'maintenance' && 'We\'ll calculate your maintenance calories to help you maintain your current weight while optimizing body composition. Balanced macros will be prioritized.'}
                  {formData.fitnessGoal === 'gain' && 'We\'ll create a moderate caloric surplus to support muscle growth. Higher carbohydrate and protein intake will be prioritized to fuel your workouts and recovery.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>
            Next Step
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Setting up...' : 'Complete Setup'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserSetupForm;
