import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { versionManager } from './config/version';
import { configManager } from './config/appConfig';
import HomeScreen from './screens/HomeScreen';
import TasksScreen from './screens/TasksScreen';
import ApiScreen from './screens/ApiScreen';
import AuthDemoScreen from './screens/AuthDemoScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return (
    <Text style={{ fontSize: 24, opacity: color === '#3b82f6' ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

export default function App() {
  useEffect(() => {
    // Log version and config on app start
    versionManager.logVersion();
    configManager.logConfig();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Tab.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1e293b',
                  borderBottomWidth: 1,
                  borderBottomColor: '#334155',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 20,
                },
                tabBarStyle: {
                  backgroundColor: '#1e293b',
                  borderTopWidth: 1,
                  borderTopColor: '#334155',
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#64748b',
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                },
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color }) => (
                    <TabIcon emoji="🏠" color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="Tasks"
                component={TasksScreen}
                options={{
                  tabBarLabel: 'Tasks',
                  tabBarIcon: ({ color }) => (
                    <TabIcon emoji="✅" color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="API"
                component={ApiScreen}
                options={{
                  tabBarLabel: 'API',
                  tabBarIcon: ({ color }) => (
                    <TabIcon emoji="🌐" color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="Auth"
                component={AuthDemoScreen}
                options={{
                  tabBarLabel: 'Auth',
                  tabBarIcon: ({ color }) => (
                    <TabIcon emoji="🔐" color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color }) => (
                    <TabIcon emoji="👤" color={color} />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
