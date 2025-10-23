import { pipeline } from '@huggingface/transformers';

export type EmotionType = 'happy' | 'sad' | 'angry' | 'fear' | 'surprise' | 'disgust' | 'neutral';

export interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  timestamp: number;
}

let emotionClassifier: any = null;

export const initEmotionDetector = async () => {
  if (!emotionClassifier) {
    console.log('Loading emotion detection model...');
    emotionClassifier = await pipeline(
      'image-classification',
      'Xenova/vit-base-patch16-224-finetuned-emotion'
    );
    console.log('Model loaded successfully');
  }
  return emotionClassifier;
};

export const detectEmotion = async (imageElement: HTMLVideoElement): Promise<EmotionResult> => {
  if (!emotionClassifier) {
    await initEmotionDetector();
  }

  const results = await emotionClassifier(imageElement);
  
  // Map model output to our emotion types
  const topResult = results[0];
  const emotionMap: Record<string, EmotionType> = {
    'happy': 'happy',
    'sad': 'sad',
    'angry': 'angry',
    'fear': 'fear',
    'surprise': 'surprise',
    'disgust': 'disgust',
    'neutral': 'neutral'
  };

  const detectedEmotion = emotionMap[topResult.label.toLowerCase()] || 'neutral';

  return {
    emotion: detectedEmotion,
    confidence: topResult.score,
    timestamp: Date.now()
  };
};

export const getEmotionEmoji = (emotion: EmotionType): string => {
  const emojiMap: Record<EmotionType, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fear: '😨',
    surprise: '😮',
    disgust: '🤢',
    neutral: '😐'
  };
  return emojiMap[emotion];
};

export const getEmotionColor = (emotion: EmotionType): string => {
  const colorMap: Record<EmotionType, string> = {
    happy: 'hsl(var(--emotion-happy))',
    sad: 'hsl(var(--emotion-sad))',
    angry: 'hsl(var(--emotion-angry))',
    fear: 'hsl(var(--emotion-fear))',
    surprise: 'hsl(var(--emotion-surprise))',
    disgust: 'hsl(var(--emotion-disgust))',
    neutral: 'hsl(var(--emotion-neutral))'
  };
  return colorMap[emotion];
};

export const getEmotionDescription = (emotion: EmotionType): string => {
  const descriptions: Record<EmotionType, string> = {
    happy: "You're feeling joyful and content. Your positive energy is radiating!",
    sad: "You seem to be experiencing some sadness. Remember, it's okay to feel this way.",
    angry: "You're feeling frustrated or upset. Take a deep breath and find your calm.",
    fear: "You might be feeling anxious or worried. Let's work on finding your peace.",
    surprise: "Something has caught you off guard! Embrace the unexpected moment.",
    disgust: "You're feeling aversion or discomfort. It's natural to have these reactions.",
    neutral: "You're in a calm, balanced state. Your emotions are stable right now."
  };
  return descriptions[emotion];
};

export const getEmotionRecommendations = (emotion: EmotionType): string[] => {
  const recommendations: Record<EmotionType, string[]> = {
    happy: [
      "🎵 Listen to your favorite upbeat playlist",
      "📝 Journal about what's making you happy",
      "🤗 Share your joy with someone you care about",
      "🎨 Channel this energy into a creative project"
    ],
    sad: [
      "🎧 Try some calming music or nature sounds",
      "🫂 Reach out to a friend or loved one",
      "🧘 Practice gentle meditation or breathing exercises",
      "📖 Read something comforting or inspiring"
    ],
    angry: [
      "🧘‍♀️ Take 5 deep breaths, in through nose, out through mouth",
      "🚶 Go for a walk to clear your mind",
      "✍️ Write down what's bothering you",
      "💪 Try a physical activity to release tension"
    ],
    fear: [
      "🌬️ Practice box breathing: 4 counts in, hold 4, out 4, hold 4",
      "🛡️ Ground yourself: name 5 things you can see",
      "☎️ Talk to someone you trust",
      "🎵 Listen to soothing music"
    ],
    surprise: [
      "📸 Capture this moment in a photo or note",
      "🤔 Reflect on what caused this reaction",
      "😊 Share this experience with others",
      "🎉 Embrace the spontaneity of life"
    ],
    disgust: [
      "🌸 Step away from the trigger if possible",
      "🧼 Do something that makes you feel fresh and clean",
      "🍃 Get some fresh air",
      "💭 Practice acceptance and let go"
    ],
    neutral: [
      "🎯 Set an intention for your day",
      "🧘 Enjoy this moment of peace",
      "📚 Learn something new",
      "🌟 Practice gratitude for this balance"
    ]
  };
  return recommendations[emotion];
};
