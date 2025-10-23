import { useState, useEffect, useCallback } from 'react';
import CameraView from '@/components/CameraView';
import EmotionDisplay from '@/components/EmotionDisplay';
import EmotionRecommendations from '@/components/EmotionRecommendations';
import EmotionHistory from '@/components/EmotionHistory';
import { initEmotionDetector, detectEmotion, EmotionResult, EmotionType } from '@/utils/emotionDetection';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles } from 'lucide-react';

const DETECTION_INTERVAL = 2000; // Detect every 2 seconds
const STORAGE_KEY = 'emotion-history';

const Index = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const { toast } = useToast();

  // Load emotion history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEmotionHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load emotion history:', e);
      }
    }
  }, []);

  // Save emotion history to localStorage
  useEffect(() => {
    if (emotionHistory.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emotionHistory));
    }
  }, [emotionHistory]);

  // Initialize model when camera is activated
  useEffect(() => {
    if (isCameraActive && !isModelReady && !isModelLoading) {
      setIsModelLoading(true);
      toast({
        title: "Loading AI Model",
        description: "Preparing emotion detection system...",
      });
      
      initEmotionDetector()
        .then(() => {
          setIsModelReady(true);
          setIsModelLoading(false);
          toast({
            title: "Ready!",
            description: "Emotion detection is now active.",
          });
        })
        .catch((error) => {
          console.error('Failed to load model:', error);
          setIsModelLoading(false);
          toast({
            title: "Error",
            description: "Failed to load AI model. Please refresh and try again.",
            variant: "destructive"
          });
        });
    }
  }, [isCameraActive, isModelReady, isModelLoading, toast]);

  // Detect emotions at regular intervals
  useEffect(() => {
    if (!isCameraActive || !isModelReady || !videoElement) {
      return;
    }

    const detectInterval = setInterval(async () => {
      try {
        const result = await detectEmotion(videoElement);
        setCurrentEmotion(result.emotion);
        setConfidence(result.confidence);
        
        // Add to history
        setEmotionHistory(prev => [...prev, result]);
      } catch (error) {
        console.error('Emotion detection error:', error);
      }
    }, DETECTION_INTERVAL);

    return () => clearInterval(detectInterval);
  }, [isCameraActive, isModelReady, videoElement]);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);
  }, []);

  const handleToggleCamera = () => {
    setIsCameraActive(prev => !prev);
    if (isCameraActive) {
      setCurrentEmotion(null);
      setConfidence(0);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Emotion AI
            </h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your emotions in real-time through advanced AI facial recognition
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Camera */}
          <div className="space-y-6">
            <div className="aspect-video">
              <CameraView
                onVideoReady={handleVideoReady}
                isActive={isCameraActive}
                onToggle={handleToggleCamera}
              />
            </div>
            
            {isCameraActive && (
              <EmotionDisplay
                emotion={currentEmotion}
                confidence={confidence}
              />
            )}
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            <EmotionRecommendations emotion={currentEmotion} />
            <EmotionHistory history={emotionHistory} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>Your emotion data is stored locally and never leaves your device</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
