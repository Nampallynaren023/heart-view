import { EmotionResult, EmotionType, getEmotionEmoji } from '@/utils/emotionDetection';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EmotionMomentsProps {
  recentEmotions: EmotionResult[];
}

interface Moment {
  emotion: EmotionType;
  timestamp: number;
  confidence: number;
}

const EmotionMoments = ({ recentEmotions }: EmotionMomentsProps) => {
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    if (recentEmotions.length < 2) return;

    const lastEmotion = recentEmotions[recentEmotions.length - 1];
    const previousEmotion = recentEmotions[recentEmotions.length - 2];

    // Detect significant emotional shift
    if (lastEmotion.emotion !== previousEmotion.emotion && lastEmotion.confidence > 0.5) {
      const newMoment: Moment = {
        emotion: lastEmotion.emotion,
        timestamp: lastEmotion.timestamp,
        confidence: lastEmotion.confidence
      };

      setMoments(prev => {
        // Keep only last 5 moments
        const updated = [newMoment, ...prev].slice(0, 5);
        return updated;
      });
    }
  }, [recentEmotions]);

  if (moments.length === 0) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="card-glass p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Emotional Moments</h3>
      </div>

      <div className="space-y-2">
        {moments.map((moment, index) => (
          <div
            key={`${moment.timestamp}-${index}`}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 animate-in fade-in slide-in-from-left-2"
          >
            <span className="text-2xl">{getEmotionEmoji(moment.emotion)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium capitalize">{moment.emotion}</p>
              <p className="text-xs text-muted-foreground">{formatTime(moment.timestamp)}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(moment.confidence * 100)}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionMoments;

