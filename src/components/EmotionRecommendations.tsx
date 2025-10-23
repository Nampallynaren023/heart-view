import { EmotionType, getEmotionRecommendations } from '@/utils/emotionDetection';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface EmotionRecommendationsProps {
  emotion: EmotionType | null;
}

const EmotionRecommendations = ({ emotion }: EmotionRecommendationsProps) => {
  if (!emotion) {
    return null;
  }

  const recommendations = getEmotionRecommendations(emotion);

  return (
    <Card className="card-glass p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Suggestions for You</h3>
      </div>

      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-lg mt-0.5">{rec.split(' ')[0]}</span>
            <span className="text-sm leading-relaxed">
              {rec.split(' ').slice(1).join(' ')}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default EmotionRecommendations;
