// frontend/src/hooks/useConfetti.ts

import { useReward } from 'react-rewards';
import { useCallback } from 'react';

/**
 * Custom hook for celebration animations
 * 
 * @example
 * ```tsx
 * const { celebrateAllTestsPassed, rewardElement } = useConfetti();
 * 
 * return (
 *   <div>
 *     {rewardElement}
 *     <Button onClick={celebrateAllTestsPassed}>
 *       Run Tests
 *     </Button>
 *   </div>
 * );
 * ```
 */
export const useConfetti = () => {
  const { reward: confettiReward } = useReward('confetti-reward', 'confetti', {
    lifetime: 200,
    angle: 90,
    decay: 0.91,
    spread: 100,
    startVelocity: 35,
    elementCount: 80,
    elementSize: 8,
  });

  const { reward: balloonsReward } = useReward('balloons-reward', 'balloons', {
    lifetime: 180,
    angle: 90,
    decay: 0.91,
    spread: 100,
    startVelocity: 30,
    elementCount: 15,
    elementSize: 20,
  });

  const { reward: emojiReward } = useReward('emoji-reward', 'emoji', {
    lifetime: 200,
    angle: 90,
    decay: 0.91,
    spread: 100,
    startVelocity: 35,
    elementCount: 30,
    elementSize: 40,
    emoji: ['🎉', '✨', '🎊', '⭐', '💫'],
  });

  /**
   * Celebration for all tests passing
   */
  const celebrateAllTestsPassed = useCallback(() => {
    confettiReward();
    // Add second burst after delay
    setTimeout(() => {
      confettiReward();
    }, 300);
  }, [confettiReward]);

  /**
   * Celebration for exercise completion
   */
  const celebrateExerciseComplete = useCallback(() => {
    balloonsReward();
    setTimeout(() => {
      emojiReward();
    }, 200);
  }, [balloonsReward, emojiReward]);

  /**
   * Achievement unlocked celebration
   */
  const celebrateAchievement = useCallback(() => {
    emojiReward();
  }, [emojiReward]);

  return {
    celebrateAllTestsPassed,
    celebrateExerciseComplete,
    celebrateAchievement,
    // Reward elements should be rendered in the component that uses this hook.
    rewardElement: (
      <>
        <span id="confetti-reward" style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 9999 }} />
        <span id="balloons-reward" style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 9999 }} />
        <span id="emoji-reward" style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 9999 }} />
      </>
    ),
  };
};