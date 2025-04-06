
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMealHistory } from '../contexts/MealHistoryContext';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalorieRing from '../components/CalorieRing';
import MacroProgressBar from '../components/MacroProgressBar';
import MealCard from '../components/MealCard';
import FeedbackCard from '../components/FeedbackCard';
import { ActivitySquare, Award, CalendarClock, CheckCircle, PieChart } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getMealsForToday, getTotalCaloriesForToday } = useMealHistory();
  const navigate = useNavigate();
  
  const profile = currentUser?.profile;
  const todaysMeals = getMealsForToday();
  const totalCaloriesConsumed = getTotalCaloriesForToday();
  
  // If user doesn't have a complete profile, redirect to setup
  useEffect(() => {
    if (currentUser && (!profile || !profile.dailyCalories)) {
      navigate('/profile/setup');
    }
  }, [currentUser, profile, navigate]);
  
  if (!profile || !profile.dailyCalories) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Setting up your profile...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Calculate macro progress
  const proteinConsumed = todaysMeals.reduce((total, meal) => total + meal.estimatedProtein, 0);
  const carbsConsumed = todaysMeals.reduce((total, meal) => total + meal.estimatedCarbs, 0);
  const fatConsumed = todaysMeals.reduce((total, meal) => total + meal.estimatedFat, 0);
  
  // Categories for rendering
  const breakfastMeals = todaysMeals.filter(meal => meal.mealType === 'breakfast');
  const lunchMeals = todaysMeals.filter(meal => meal.mealType === 'lunch');
  const dinnerMeals = todaysMeals.filter(meal => meal.mealType === 'dinner');
  const snackMeals = todaysMeals.filter(meal => meal.mealType === 'snack');
  
  // Sort meals by timestamp, most recent first
  const recentMeals = [...todaysMeals].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Daily Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Calorie Summary */}
          <Card className="fitvision-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-4">
                <CalorieRing consumed={totalCaloriesConsumed} target={profile.dailyCalories} />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Goal</p>
                  <p className="text-2xl font-bold">{profile.dailyCalories}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold">{Math.max(0, profile.dailyCalories - totalCaloriesConsumed)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Macros Summary */}
          <Card className="fitvision-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Macro Nutrients</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <MacroProgressBar 
                macroName="Protein" 
                current={proteinConsumed} 
                target={profile.dailyProtein || 0} 
                color="bg-fit-blue"
              />
              <MacroProgressBar 
                macroName="Carbs" 
                current={carbsConsumed} 
                target={profile.dailyCarbs || 0} 
                color="bg-fit-green"
              />
              <MacroProgressBar 
                macroName="Fat" 
                current={fatConsumed} 
                target={profile.dailyFat || 0} 
                color="bg-fit-indigo"
              />
            </CardContent>
          </Card>
          
          {/* Goal Progress */}
          <Card className="fitvision-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  <span className="capitalize">{profile.fitnessGoal}</span> Goal
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-4 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{todaysMeals.length}</p>
                    <p className="text-xs text-muted-foreground">Meals Tracked</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-center text-sm text-muted-foreground">
                  {profile.fitnessGoal === 'fat loss' && 'Focus on your calorie deficit for fat loss success!'}
                  {profile.fitnessGoal === 'maintenance' && 'Stay consistent with your balanced nutrition!'}
                  {profile.fitnessGoal === 'gain' && 'Keep hitting your protein goals for muscle growth!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Meals Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Today's Meals</h2>
          
          {todaysMeals.length === 0 ? (
            <Card className="fitvision-border">
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-muted">
                      <ActivitySquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No meals tracked yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload your first meal to start tracking your nutrition
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Categories of meals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {breakfastMeals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span>🍳</span> Breakfast
                    </h3>
                    <div className="space-y-4">
                      {breakfastMeals.map((meal, index) => (
                        <MealCard key={`breakfast-${index}`} meal={meal} />
                      ))}
                    </div>
                  </div>
                )}
                
                {lunchMeals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span>🥗</span> Lunch
                    </h3>
                    <div className="space-y-4">
                      {lunchMeals.map((meal, index) => (
                        <MealCard key={`lunch-${index}`} meal={meal} />
                      ))}
                    </div>
                  </div>
                )}
                
                {dinnerMeals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span>🍽️</span> Dinner
                    </h3>
                    <div className="space-y-4">
                      {dinnerMeals.map((meal, index) => (
                        <MealCard key={`dinner-${index}`} meal={meal} />
                      ))}
                    </div>
                  </div>
                )}
                
                {snackMeals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <span>🍌</span> Snacks
                    </h3>
                    <div className="space-y-4">
                      {snackMeals.map((meal, index) => (
                        <MealCard key={`snack-${index}`} meal={meal} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Recent Feedback */}
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Recent Feedback
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {recentMeals.slice(0, 3).map((meal, index) => (
                    <FeedbackCard key={`feedback-${index}`} meal={meal} compact />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
