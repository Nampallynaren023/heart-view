import { Card } from '@/components/ui/card';
import { EmotionResult, getEmotionColor, getEmotionEmoji } from '@/utils/emotionDetection';
import { Activity } from 'lucide-react';

interface EmotionTimelineProps {
  recentEmotions: EmotionResult[];
}

const EmotionTimeline = ({ recentEmotions }: EmotionTimelineProps) => {
  // Get last 30 emotions for smooth timeline (15 seconds at 0.5s intervals)
  const timeline = recentEmotions.slice(-30);

  if (timeline.length === 0) {
    return null;
  }

  return (
    <Card className="card-glass p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Live Emotion Timeline</h3>
      </div>
      
      <div className="flex items-end gap-1 h-16 overflow-hidden">
        {timeline.map((result, index) => {
          const color = getEmotionColor(result.emotion);
          const height = Math.max(20, result.confidence * 100);
          const emoji = getEmotionEmoji(result.emotion);
          
          return (
            <div
              key={`${result.timestamp}-${index}`}
              className="flex-1 min-w-[4px] rounded-t transition-all duration-300 relative group"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                opacity: 0.7 + (index / timeline.length) * 0.3
              }}
              title={`${result.emotion} - ${Math.round(result.confidence * 100)}%`}
            >
              {index === timeline.length - 1 && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">
                  {emoji}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Past</span>
        <span>Now</span>
      </div>
    </Card>
  );
};

export default EmotionTimeline;
