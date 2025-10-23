import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EmotionResult, EmotionType, getEmotionColor } from '@/utils/emotionDetection';
import { History } from 'lucide-react';

interface EmotionHistoryProps {
  history: EmotionResult[];
}

const EmotionHistory = ({ history }: EmotionHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="card-glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Emotion Timeline</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">
          Start analyzing to see your emotion history
        </p>
      </Card>
    );
  }

  // Aggregate emotions by type
  const emotionCounts = history.reduce((acc, item) => {
    acc[item.emotion] = (acc[item.emotion] || 0) + 1;
    return acc;
  }, {} as Record<EmotionType, number>);

  // Prepare data for pie chart visualization
  const chartData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: count,
    color: getEmotionColor(emotion as EmotionType)
  }));

  // Get recent emotions for timeline (last 20)
  const recentHistory = history.slice(-20).map((item, index) => ({
    time: index + 1,
    confidence: Math.round(item.confidence * 100),
    emotion: item.emotion
  }));

  return (
    <Card className="card-glass p-6 space-y-6">
      <div className="flex items-center gap-3">
        <History className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold">Emotion Timeline</h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={recentHistory}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="p-3 rounded-lg border border-border text-center space-y-1"
            style={{
              backgroundColor: `${item.color}15`
            }}
          >
            <div className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">{item.name}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Total scans: {history.length}
      </div>
    </Card>
  );
};

export default EmotionHistory;
