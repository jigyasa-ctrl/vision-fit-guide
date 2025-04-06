import { UserProfile } from "../contexts/AuthContext";

export type Macro = {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
};

export type MealPlan = {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  breakfast: Macro;
  lunch: Macro;
  dinner: Macro;
  snack: Macro;
};

// Katch-McArdle Formula for BMR
export function calculateBMR(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: 'male' | 'female',
  bodyFatPercentage?: number
): number {
  // If body fat percentage is provided, use Katch-McArdle
  if (bodyFatPercentage) {
    // Calculate lean body mass
    const leanBodyMass = weight * (1 - bodyFatPercentage / 100);
    // Katch-McArdle formula
    return 370 + (21.6 * leanBodyMass);
  }
  
  // Otherwise use Mifflin-St Jeor
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calculate TDEE based on activity level
export function calculateTDEE(
  bmr: number,
  activityLevel: UserProfile['activityLevel'],
  stepsPerDay: number,
  workoutIntensity: UserProfile['workoutIntensity']
): number {
  // Base multiplier based on activity level
  let activityMultiplier: number;
  
  switch(activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'active':
      activityMultiplier = 1.725;
      break;
    case 'very active':
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.2;
  }
  
  // Additional calorie burn from steps
  // Rough estimate: 0.04 calories per step for a 70kg person
  const stepCalories = (stepsPerDay * 0.04) * (70 / 70); // Adjust for weight if necessary
  
  // Additional calories from workout intensity
  let workoutCalories: number;
  
  switch(workoutIntensity) {
    case 'low':
      workoutCalories = 100;
      break;
    case 'medium':
      workoutCalories = 200;
      break;
    case 'high':
      workoutCalories = 300;
      break;
    default:
      workoutCalories = 0;
  }
  
  // Calculate TDEE
  const baseTDEE = bmr * activityMultiplier;
  
  // Return adjusted TDEE
  return Math.round(baseTDEE + workoutCalories);
}

// Calculate target calories based on goal
export function calculateTargetCalories(tdee: number, goal: UserProfile['fitnessGoal']): number {
  switch(goal) {
    case 'fat loss':
      return Math.round(tdee * 0.8); // 20% deficit
    case 'maintenance':
      return tdee;
    case 'gain':
      return Math.round(tdee * 1.1); // 10% surplus
    default:
      return tdee;
  }
}

// Calculate macros based on target calories and goal
export function calculateMacros(
  targetCalories: number,
  bodyWeight: number, // in kg
  goal: UserProfile['fitnessGoal']
): {protein: number, fat: number, carbs: number} {
  let proteinMultiplier: number;
  let fatPercentage: number;
  
  switch(goal) {
    case 'fat loss':
      proteinMultiplier = 2.2; // 2.2g per kg of bodyweight
      fatPercentage = 0.25; // 25% of calories from fat
      break;
    case 'maintenance':
      proteinMultiplier = 1.8; // 1.8g per kg of bodyweight
      fatPercentage = 0.3; // 30% of calories from fat
      break;
    case 'gain':
      proteinMultiplier = 2.0; // 2.0g per kg of bodyweight
      fatPercentage = 0.25; // 25% of calories from fat
      break;
    default:
      proteinMultiplier = 1.8;
      fatPercentage = 0.3;
  }
  
  // Calculate protein (4 calories per gram)
  const protein = Math.round(bodyWeight * proteinMultiplier);
  const proteinCalories = protein * 4;
  
  // Calculate fat (9 calories per gram)
  const fatCalories = targetCalories * fatPercentage;
  const fat = Math.round(fatCalories / 9);
  
  // Calculate carbs (4 calories per gram)
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4);
  
  return { protein, fat, carbs };
}

// Split macros into meals
export function createMealPlan(
  targetCalories: number,
  protein: number,
  carbs: number,
  fat: number
): MealPlan {
  const mealDistribution = {
    breakfast: 0.25, // 25%
    lunch: 0.35, // 35%
    dinner: 0.30, // 30%
    snack: 0.10 // 10%
  };
  
  const breakfast: Macro = {
    calories: Math.round(targetCalories * mealDistribution.breakfast),
    protein: Math.round(protein * mealDistribution.breakfast),
    carbs: Math.round(carbs * mealDistribution.breakfast),
    fat: Math.round(fat * mealDistribution.breakfast)
  };
  
  const lunch: Macro = {
    calories: Math.round(targetCalories * mealDistribution.lunch),
    protein: Math.round(protein * mealDistribution.lunch),
    carbs: Math.round(carbs * mealDistribution.lunch),
    fat: Math.round(fat * mealDistribution.lunch)
  };
  
  const dinner: Macro = {
    calories: Math.round(targetCalories * mealDistribution.dinner),
    protein: Math.round(protein * mealDistribution.dinner),
    carbs: Math.round(carbs * mealDistribution.dinner),
    fat: Math.round(fat * mealDistribution.dinner)
  };
  
  const snack: Macro = {
    calories: Math.round(targetCalories * mealDistribution.snack),
    protein: Math.round(protein * mealDistribution.snack),
    carbs: Math.round(carbs * mealDistribution.snack),
    fat: Math.round(fat * mealDistribution.snack)
  };
  
  return {
    dailyCalories: targetCalories,
    dailyProtein: protein,
    dailyCarbs: carbs,
    dailyFat: fat,
    breakfast,
    lunch,
    dinner,
    snack
  };
}

// Comprehensive function to generate a complete meal plan based on user profile
export function generateMealPlan(profile: UserProfile): MealPlan {
  const bmr = calculateBMR(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFatPercentage
  );
  
  const tdee = calculateTDEE(
    bmr,
    profile.activityLevel,
    profile.stepsPerDay,
    profile.workoutIntensity
  );
  
  const targetCalories = calculateTargetCalories(tdee, profile.fitnessGoal);
  
  const { protein, carbs, fat } = calculateMacros(
    targetCalories,
    profile.weight,
    profile.fitnessGoal
  );
  
  return createMealPlan(targetCalories, protein, carbs, fat);
}
