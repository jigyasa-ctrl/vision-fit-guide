import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { MealAnalysisResult } from '../lib/ai';
import { motion } from 'framer-motion';

interface FeedbackCardProps {
  meal: MealAnalysisResult;
  compact?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ meal, compact = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-4 border-yellow-400 overflow-hidden fitvision-border ${compact ? 'h-full' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              {meal.dishName}
            </h3>
            <div>
              {meal.verdict === 'Approved' ? (
                <CheckCircle className="h-5 w-5 text-yellow-500" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-700" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {compact ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {meal.feedback[0]}
            </p>
          ) : (
            <ul className="text-sm space-y-2">
              {meal.feedback.map((feedback, index) => (
                <li key={index} className="text-muted-foreground">
                  {feedback}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeedbackCard;
