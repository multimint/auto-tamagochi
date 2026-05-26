import { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import { ToastProvider }         from '@/context/ToastContext';

import { HomeScreen }         from '@/screens/HomeScreen';
import { PetScreen }          from '@/screens/PetScreen';
import { InventoryScreen }    from '@/screens/InventoryScreen';
import { AchievementsScreen } from '@/screens/AchievementsScreen';
import { SettingsScreen }     from '@/screens/SettingsScreen';
import { TutorialScreen }     from '@/screens/TutorialScreen';
import { GameOverScreen }     from '@/screens/GameOverScreen';
import { DesktopSidebar }     from '@/components/DesktopSidebar';
import { useMediaQuery }      from '@/hooks/useMediaQuery';

import type { Screen } from '@/types';

const SCREEN_COMPONENTS: Record<Screen, React.ComponentType> = {
  home:         HomeScreen,
  pet:          PetScreen,
  inventory:    InventoryScreen,
  achievements: AchievementsScreen,
  settings:     SettingsScreen,
  tutorial:     TutorialScreen,
  gameover:     GameOverScreen,
};

// Screens where the sidebar should NOT appear (no active pet session)
const FULL_WIDTH_SCREENS: Screen[] = ['home', 'gameover'];

function AppContent() {
  const { currentScreen, settings } = useGame();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const showSidebar = isDesktop && !FULL_WIDTH_SCREENS.includes(currentScreen);

  // Apply prefers-reduced-motion on mount
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !settings.animationsEnabled) {
      document.documentElement.classList.add('no-animations');
    } else {
      document.documentElement.classList.remove('no-animations');
    }
  }, [settings.animationsEnabled]);

  const CurrentScreen = SCREEN_COMPONENTS[currentScreen] ?? HomeScreen;

  return (
    <div className={`app-container${showSidebar ? ' has-sidebar' : ''}`}>
      {showSidebar && <DesktopSidebar />}
      <CurrentScreen />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </GameProvider>
  );
}
