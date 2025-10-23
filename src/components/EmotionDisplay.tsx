import { EmotionType, getEmotionEmoji, getEmotionColor, getEmotionDescription } from '@/utils/emotionDetection';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EmotionDisplayProps {
  emotion: EmotionType | null;
  confidence: number;
}

const EmotionDisplay = ({ emotion, confidence }: EmotionDisplayProps) => {
  if (!emotion) {
    return (
      <Card className="card-glass p-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl">🤔</div>
          <h3 className="text-2xl font-semibold">Analyzing...</h3>
          <p className="text-muted-foreground">
            Looking at your expression to detect your emotion
          </p>
        </div>
      </Card>
    );
  }

  const emoji = getEmotionEmoji(emotion);
  const color = getEmotionColor(emotion);
  const description = getEmotionDescription(emotion);

  return (
    <Card className="card-glass p-8 space-y-6">
      <div className="text-center space-y-4">
        <div 
          className="text-8xl transition-all duration-500 emotion-glow inline-block"
          style={{ filter: `drop-shadow(0 0 20px ${color})` }}
        >
          {emoji}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-3xl font-bold capitalize" style={{ color }}>
            {emotion}
          </h3>
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Confidence Level</span>
          <span className="text-muted-foreground">{Math.round(confidence * 100)}%</span>
        </div>
        <Progress 
          value={confidence * 100} 
          className="h-3"
          style={{
            // @ts-ignore
            '--progress-background': color
          }}
        />
      </div>
    </Card>
  );
};

export default EmotionDisplay;
