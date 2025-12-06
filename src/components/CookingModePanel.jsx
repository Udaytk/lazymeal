import { useState, useEffect } from 'react';

const API_BASE_URL = '/api';

function CookingModePanel({ recipe, currentStep, setCurrentStep, onClose }) {
  const [guidance, setGuidance] = useState('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSteps = recipe.steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    setShowGuidance(false);
    setGuidance('');
    // Stop any ongoing speech when step changes
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [currentStep]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePrevious = () => {
    if (!isFirstStep) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('🎉 Meal complete! Enjoy your lazy cooking!');
      onClose();
    }
  };

  const handleGuideMe = async () => {
    setLoadingGuidance(true);
    setShowGuidance(true);

    try {
      const response = await fetch(`${API_BASE_URL}/voice-guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, step: currentStep }),
      });

      if (!response.ok) throw new Error('Failed to get guidance');

      const data = await response.json();
      setGuidance(data.guidance);

      // Start speaking automatically
      if ('speechSynthesis' in window && data.guidance) {
        speakText(data.guidance);
      }
    } catch (error) {
      console.error('Error:', error);
      setGuidance('Oops! Could not get guidance right now. But you got this! 💪');
    } finally {
      setLoadingGuidance(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handlePlayPause = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && !isPaused) {
        // Pause
        speechSynthesis.pause();
        setIsPaused(true);
      } else if (isPaused) {
        // Resume
        speechSynthesis.resume();
        setIsPaused(false);
      } else if (guidance) {
        // Start speaking if not already
        speakText(guidance);
      }
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="glass-card rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Glassmorphic Header */}
        <div className="sticky top-0 glass-strong border-b border-white/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 rounded-t-3xl flex items-center justify-between backdrop-blur-xl z-10">
          <div className="flex-1 pr-3 sm:pr-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
              {recipe.name}
            </h2>
            <div className="mt-1 sm:mt-2 inline-flex items-center gap-1 sm:gap-2 glass px-3 sm:px-4 py-1 rounded-full">
              <span className="text-purple-600 font-bold text-xs sm:text-sm">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Current Step with Gradient Background */}
          <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 opacity-50"></div>
            <div className="relative glass-strong p-4 sm:p-6 lg:p-8 border-2 border-white/30">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                  {currentStep + 1}
                </div>
                <p className="flex-1 text-base sm:text-xl lg:text-2xl leading-relaxed text-gray-800 font-medium">
                  {recipe.steps[currentStep]}
                </p>
              </div>
            </div>
          </div>

          {/* Voice Guidance with Play/Pause Controls */}
          {showGuidance && (
            <div className="mb-4 sm:mb-6 animate-fadeIn">
              <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-blue-500">
                {loadingGuidance ? (
                  <div className="flex items-center gap-2 sm:gap-3 text-blue-600">
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-semibold text-sm sm:text-base">Getting your guide...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2 sm:gap-3 mb-3">
                      <span className="text-2xl sm:text-3xl">🎙️</span>
                      <p className="flex-1 text-gray-700 leading-relaxed italic text-sm sm:text-base lg:text-lg">
                        {guidance}
                      </p>
                    </div>
                    
                    {/* Play/Pause/Stop Controls */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/30">
                      <button
                        onClick={handlePlayPause}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        {isSpeaking && !isPaused ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>
                            </svg>
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                            <span>{isPaused ? 'Resume' : 'Play'}</span>
                          </>
                        )}
                      </button>
                      
                      {(isSpeaking || isPaused) && (
                        <button
                          onClick={handleStop}
                          className="flex items-center gap-2 px-4 py-2 glass-strong hover:glass text-gray-700 font-semibold text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/30"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"/>
                          </svg>
                          <span>Stop</span>
                        </button>
                      )}
                      
                      {/* Speaking Indicator */}
                      {isSpeaking && !isPaused && (
                        <div className="flex items-center gap-2 ml-auto">
                          <div className="flex gap-1">
                            <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs text-blue-600 font-semibold">Speaking...</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="py-3 sm:py-4 px-4 sm:px-6 glass-strong hover:glass text-gray-800 font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg disabled:hover:scale-100 border border-white/30"
            >
              ← Previous
            </button>

            <button
              onClick={handleGuideMe}
              disabled={loadingGuidance}
              className="py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl">🎤</span>
                {loadingGuidance ? 'Loading...' : 'Guide Me'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>

            <button
              onClick={handleNext}
              className="py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLastStep ? '✓ Finish' : 'Next →'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookingModePanel;
