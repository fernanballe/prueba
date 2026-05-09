import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-1">
      <Text className={`text-xl ${focused ? 'opacity-100' : 'opacity-50'}`}>{emoji}</Text>
      <Text
        className={`text-xs mt-0.5 font-body ${
          focused ? 'text-gold font-body-bold' : 'text-stamp'
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#f5f0e8',
          borderTopColor: '#c9a84c',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#c9a84c',
        tabBarInactiveTintColor: '#7a7060',
      }}
    >
      <Tabs.Screen
        name="atlas"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🗺️" label="Atlas" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📖" label="Pasaporte" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎮" label="Jugar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏆" label="Social" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Perfil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
