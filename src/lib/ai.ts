
import { UserProfile } from "../contexts/AuthContext";
import { toast } from "sonner";

export type MealAnalysisResult = {
  dishName: string;
  estimatedCalories: number;
  estimatedProtein: number;
  estimatedCarbs: number;
  estimatedFat: number;
  verdict: 'Approved' | 'Rejected';
  feedback: string[];
  timestamp: Date;
  imageUrl?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

// Mock database of detected foods
const foodDatabase: Record<string, { 
  calories: number, 
  protein: number, 
  carbs: number, 
  fat: number 
}> = {
  "salad": { calories: 200, protein: 5, carbs: 10, fat: 15 },
  "chicken breast": { calories: 300, protein: 40, carbs: 0, fat: 7 },
  "steak": { calories: 450, protein: 35, carbs: 0, fat: 30 },
  "pizza": { calories: 700, protein: 25, carbs: 80, fat: 30 },
  "smoothie": { calories: 250, protein: 12, carbs: 40, fat: 3 },
  "burger": { calories: 650, protein: 30, carbs: 45, fat: 40 },
  "pasta": { calories: 550, protein: 15, carbs: 90, fat: 10 },
  "salmon": { calories: 350, protein: 36, carbs: 0, fat: 20 },
  "yogurt bowl": { calories: 300, protein: 15, carbs: 40, fat: 8 },
  "oatmeal": { calories: 250, protein: 8, carbs: 45, fat: 5 },
  "eggs and toast": { calories: 350, protein: 18, carbs: 30, fat: 15 },
  "protein shake": { calories: 220, protein: 30, carbs: 10, fat: 5 },
  "rice bowl": { calories: 480, protein: 15, carbs: 70, fat: 12 },
  "stir fry": { calories: 400, protein: 25, carbs: 35, fat: 15 }
};

// Mock image recognition API that returns a food classification
export async function identifyMealFromImage(imageFile: File): Promise<string> {
  // In a real app, you'd upload the image to a real API and get a classification
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Randomly select a food from our database
      const foods = Object.keys(foodDatabase);
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      resolve(randomFood);
    }, 1500);
  });
}

// Mock feedback generation using a template system similar to a prompt
export function generateMealFeedback(
  profile: UserProfile,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  dishName: string,
  estimatedCalories: number,
  estimatedProtein: number,
  estimatedCarbs: number,
  estimatedFat: number
): {
  verdict: 'Approved' | 'Rejected',
  feedback: string[]
} {
  if (!profile.meals) {
    return {
      verdict: 'Rejected',
      feedback: ['Could not analyze meal: No meal targets found in your profile.']
    };
  }
  
  // Get target macros for this meal type
  const targetMacros = profile.meals[mealType];
  const targetCalories = targetMacros.calories;
  const targetProtein = targetMacros.protein;
  const targetCarbs = targetMacros.carbs;
  const targetFat = targetMacros.fat;
  
  // Calculate differences
  const caloriesDiff = estimatedCalories - targetCalories;
  const proteinDiff = estimatedProtein - targetProtein;
  const carbsDiff = estimatedCarbs - targetCarbs;
  const fatDiff = estimatedFat - targetFat;
  
  // Begin feedback generation
  const feedback = [];
  
  // Calorie analysis
  const caloriePercentage = Math.round((estimatedCalories / targetCalories) * 100);
  if (Math.abs(caloriesDiff) <= targetCalories * 0.1) {
    feedback.push(`✅ Great job! Your ${dishName} is within 10% of your calorie target for this meal.`);
  } else if (caloriesDiff > 0) {
    feedback.push(`⚠️ This ${dishName} is ${caloriePercentage}% of your calorie target (${Math.abs(caloriesDiff)} calories too high).`);
  } else {
    feedback.push(`ℹ️ This ${dishName} is only ${caloriePercentage}% of your calorie target (${Math.abs(caloriesDiff)} calories below target).`);
  }
  
  // Protein analysis
  if (proteinDiff >= 0) {
    feedback.push(`💪 Good protein content! You're getting ${estimatedProtein}g of protein, meeting or exceeding your ${targetProtein}g target.`);
  } else if (proteinDiff >= -5) {
    feedback.push(`✅ Protein is close to target. You're getting ${estimatedProtein}g of ${targetProtein}g target.`);
  } else {
    feedback.push(`⚠️ This meal is low in protein. Consider adding a protein source to reach your ${targetProtein}g target.`);
  }
  
  // Generate goal-specific feedback
  switch(profile.fitnessGoal) {
    case 'fat loss':
      if (caloriesDiff > 0) {
        feedback.push(`🔻 For fat loss: Consider reducing portion size or choosing lower-calorie alternatives.`);
      }
      if (fatDiff > 0) {
        feedback.push(`🔻 For fat loss: This meal is higher in fat than optimal. Try leaner protein sources.`);
      }
      break;
      
    case 'gain':
      if (caloriesDiff < 0) {
        feedback.push(`⬆️ For muscle gain: Try adding more calorie-dense foods to meet your surplus goal.`);
      }
      if (proteinDiff < 0) {
        feedback.push(`⬆️ For muscle gain: Add more protein to support muscle growth and recovery.`);
      }
      break;
      
    case 'maintenance':
      if (Math.abs(caloriesDiff) > targetCalories * 0.15) {
        feedback.push(`⚖️ For maintenance: Try to keep meals closer to your calorie targets for consistent energy.`);
      }
      break;
  }
  
  // Determine verdict
  let verdict: 'Approved' | 'Rejected';
  
  // Approve if:
  // 1. Calories are within 20% of target
  // 2. Protein is at least 80% of target
  if (
    Math.abs(caloriesDiff) <= targetCalories * 0.2 &&
    estimatedProtein >= targetProtein * 0.8
  ) {
    verdict = 'Approved';
  } else {
    verdict = 'Rejected';
  }
  
  // Simplify feedback if too many items
  if (feedback.length > 3) {
    feedback.splice(3);
  }
  
  return { verdict, feedback };
}

// Comprehensive meal analysis function
export async function analyzeMeal(
  profile: UserProfile,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  imageFile: File
): Promise<MealAnalysisResult> {
  try {
    const dishName = await identifyMealFromImage(imageFile);
    
    if (!dishName) {
      throw new Error('Could not identify the meal from the image');
    }
    
    // Get nutritional info from our mock database
    const nutritionInfo = foodDatabase[dishName];
    
    if (!nutritionInfo) {
      throw new Error(`No nutritional data available for ${dishName}`);
    }
    
    // Generate AI feedback
    const { verdict, feedback } = generateMealFeedback(
      profile,
      mealType,
      dishName,
      nutritionInfo.calories,
      nutritionInfo.protein,
      nutritionInfo.carbs,
      nutritionInfo.fat
    );
    
    // Create file URL for displaying the image
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Return analysis result
    return {
      dishName,
      estimatedCalories: nutritionInfo.calories,
      estimatedProtein: nutritionInfo.protein,
      estimatedCarbs: nutritionInfo.carbs,
      estimatedFat: nutritionInfo.fat,
      verdict,
      feedback,
      timestamp: new Date(),
      imageUrl,
      mealType
    };
  } catch (error) {
    console.error('Error analyzing meal:', error);
    toast.error('Failed to analyze your meal');
    throw error;
  }
}
