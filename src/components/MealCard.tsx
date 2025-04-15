import React from 'react';
import { MealAnalysisResult } from '../lib/ai';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlarmClock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface MealCardProps {
  meal: MealAnalysisResult;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const mealTypeEmoji = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍌'
  };

  const timeAgo = formatDistanceToNow(new Date(meal.timestamp), { addSuffix: true });
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-4 overflow-hidden border-yellow-400 fitvision-border hover:shadow-md transition-shadow">
        <div className="relative">
          {meal.imageUrl && (
            <img 
              src={meal.imageUrl} 
              alt={meal.dishName} 
              className="w-full h-48 object-cover"
            />
          )}
          <div className="absolute top-0 right-0 m-2">
            {meal.verdict === 'Approved' ? (
              <div className="bg-yellow-500 text-white rounded-full p-1">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            ) : (
              <div className="bg-red-500 text-white rounded-full p-1">
                <XCircle className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>{mealTypeEmoji[meal.mealType]}</span>
              {meal.dishName}
            </h3>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <AlarmClock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex justify-between text-sm mb-2">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{meal.estimatedCalories} kcal</span>
              <span className="text-xs text-muted-foreground">Calories</span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">{meal.estimatedProtein}g</span>
                <span className="text-xs text-muted-foreground">Protein</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="font-medium">{meal.estimatedCarbs}g</span>
                <span className="text-xs text-muted-foreground">Carbs</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="font-medium">{meal.estimatedFat}g</span>
                <span className="text-xs text-muted-foreground">Fat</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Feedback:</h4>
            <ul className="text-sm space-y-1">
              {meal.feedback.map((item, index) => (
                <li key={index} className="text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="w-full border-t pt-3">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className={meal.verdict === 'Approved' ? "text-yellow-600 font-medium" : "text-red-600 font-medium"}>
                  {meal.verdict}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MealCard;
