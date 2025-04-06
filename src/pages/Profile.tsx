
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Weight, Ruler, Activity, Target, Dumbbell } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const profile = currentUser?.profile;
  
  useEffect(() => {
    // If user doesn't have a profile, redirect to setup
    if (currentUser && !currentUser.profile) {
      navigate('/profile/setup');
    }
  }, [currentUser, navigate]);
  
  if (!profile) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading your profile...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleEditProfile = () => {
    navigate('/profile/setup');
  };
  
  // Helper function to format activity level for display
  const formatActivityLevel = (level: string) => {
    return level.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Button onClick={handleEditProfile} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Information */}
            <Card className="fitvision-border">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">{profile.weight} kg</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Height</p>
                    <p className="text-sm text-muted-foreground">{profile.height} cm</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM5 22v-5a7 7 0 0 1 14 0v5H5z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Age & Gender</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.age} years • {profile.gender === 'male' ? 'Male' : 'Female'}
                    </p>
                  </div>
                </div>
                
                {profile.bodyFatPercentage && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M17.66 8L12 2.35 6.34 8A8 8 0 0 0 12 20a8 8 0 0 0 5.66-12zm-1.41 1.41L12 5.16 7.75 9.41a6 6 0 1 0 8.5 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Body Fat Percentage</p>
                      <p className="text-sm text-muted-foreground">{profile.bodyFatPercentage}%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Activity & Goals */}
            <Card className="fitvision-border">
              <CardHeader>
                <CardTitle className="text-lg">Activity & Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fitness Goal</p>
                    <p className="text-sm text-muted-foreground capitalize">{profile.fitnessGoal}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Activity Level</p>
                    <p className="text-sm text-muted-foreground">
                      {formatActivityLevel(profile.activityLevel)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M13.5 5.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-4 7A8.5 8.5 0 0 0 1 21h18a8.5 8.5 0 0 0-9.5-8.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Steps Per Day</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.stepsPerDay.toLocaleString()} steps
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Workout Intensity</p>
                    <p className="text-sm text-muted-foreground capitalize">{profile.workoutIntensity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Nutrition Plan */}
            <Card className="fitvision-border">
              <CardHeader>
                <CardTitle className="text-lg">Nutrition Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Daily Targets</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-semibold">{profile.dailyCalories} kcal</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-semibold">{profile.dailyProtein} g</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{profile.dailyCarbs} g</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="font-semibold">{profile.dailyFat} g</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Daily Breakdown</p>
                  <div className="space-y-3">
                    {profile.meals && Object.entries(profile.meals).map(([mealName, macro]) => (
                      <div key={mealName} className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <p className="text-xs capitalize font-medium">{mealName}</p>
                          <p className="text-xs text-muted-foreground">{macro.calories} kcal</p>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>P: {macro.protein}g</span>
                          <span>C: {macro.carbs}g</span>
                          <span>F: {macro.fat}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Subscription Status */}
          <Card className="mt-6 fitvision-border">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Subscription Status</h3>
                  <p className="text-sm text-muted-foreground">
                    You're currently on a 7-day free trial ending on{' '}
                    {currentUser.trialEnds.toLocaleDateString()}
                  </p>
                </div>
                <Button className="mt-4 md:mt-0">Upgrade to Premium</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
