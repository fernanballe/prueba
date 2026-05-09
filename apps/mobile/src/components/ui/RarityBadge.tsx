import { View, Text } from 'react-native';
import type { RarityLevel } from '@worlddex/shared-types';
import { RARITY_CONFIG } from '@worlddex/game-engine';

interface RarityBadgeProps {
  rarity: RarityLevel;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  const config = RARITY_CONFIG[rarity];

  return (
    <View
      className="rounded-full px-2 py-0.5 flex-row items-center gap-1"
      style={{ backgroundColor: `${config.color}20` }}
    >
      <Text className="text-xs" style={{ color: config.color }}>
        {'⭐'.repeat(config.stars)}
      </Text>
      <Text className="font-body text-xs" style={{ color: config.color }}>
        {config.label}
      </Text>
    </View>
  );
}
