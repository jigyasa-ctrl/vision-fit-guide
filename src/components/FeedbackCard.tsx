
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { MealAnalysisResult } from '../lib/ai';

interface FeedbackCardProps {
  meal: MealAnalysisResult;
  compact?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ meal, compact = false }) => {
  return (
    <Card className={`overflow-hidden fitvision-border ${compact ? 'h-full' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            {meal.dishName}
          </h3>
          <div>
            {meal.verdict === 'Approved' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
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
  );
};

export default FeedbackCard;
