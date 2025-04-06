
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MealAnalysisResult } from '../lib/ai';

interface MealHistoryContextType {
  meals: MealAnalysisResult[];
  addMeal: (meal: MealAnalysisResult) => void;
  getMealsForToday: () => MealAnalysisResult[];
  getMealsByDate: (date: Date) => MealAnalysisResult[];
  getTotalCaloriesForToday: () => number;
}

const MealHistoryContext = createContext<MealHistoryContextType | undefined>(undefined);

interface MealHistoryProviderProps {
  children: ReactNode;
}

export const MealHistoryProvider: React.FC<MealHistoryProviderProps> = ({ children }) => {
  const [meals, setMeals] = useState<MealAnalysisResult[]>([]);

  // Load meals from localStorage on component mount
  useEffect(() => {
    const storedMeals = localStorage.getItem('fitvision_meals');
    if (storedMeals) {
      try {
        const parsedMeals = JSON.parse(storedMeals);
        // Convert timestamp strings back to Date objects
        const mealsWithDates = parsedMeals.map((meal: any) => ({
          ...meal,
          timestamp: new Date(meal.timestamp)
        }));
        setMeals(mealsWithDates);
      } catch (error) {
        console.error('Failed to parse stored meals:', error);
      }
    }
  }, []);

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fitvision_meals', JSON.stringify(meals));
  }, [meals]);

  const addMeal = (meal: MealAnalysisResult) => {
    setMeals(prevMeals => [...prevMeals, meal]);
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Get meals for today
  const getMealsForToday = () => {
    const today = new Date();
    return meals.filter(meal => isSameDay(meal.timestamp, today));
  };

  // Get meals for a specific date
  const getMealsByDate = (date: Date) => {
    return meals.filter(meal => isSameDay(meal.timestamp, date));
  };

  // Get total calories consumed today
  const getTotalCaloriesForToday = () => {
    const todaysMeals = getMealsForToday();
    return todaysMeals.reduce((total, meal) => total + meal.estimatedCalories, 0);
  };

  const value = {
    meals,
    addMeal,
    getMealsForToday,
    getMealsByDate,
    getTotalCaloriesForToday
  };

  return (
    <MealHistoryContext.Provider value={value}>
      {children}
    </MealHistoryContext.Provider>
  );
};

export const useMealHistory = () => {
  const context = useContext(MealHistoryContext);
  if (!context) {
    throw new Error('useMealHistory must be used within a MealHistoryProvider');
  }
  return context;
};
