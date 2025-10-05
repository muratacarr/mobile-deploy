import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { usePosts, useUsers } from '../hooks/useApi';
import { useState } from 'react';
import { getErrorMessage } from '../utils/errorHandler';

export default function ApiScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
    isRefetching: postsRefetching
  } = usePosts();

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
    isRefetching: usersRefetching
  } = useUsers();

  const isLoading = activeTab === 'posts' ? postsLoading : usersLoading;
  const isRefetching = activeTab === 'posts' ? postsRefetching : usersRefetching;
  const error = activeTab === 'posts' ? postsError : usersError;

  const handleRefresh = () => {
    if (activeTab === 'posts') {
      refetchPosts();
    } else {
      refetchUsers();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌐</Text>
        <Text style={styles.title}>API Demo</Text>
        <Text style={styles.subtitle}>TanStack Query • JSONPlaceholder</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            📝 Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            👥 Users
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading {activeTab}...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to load {activeTab}</Text>
          <Text style={styles.errorText}>{getErrorMessage(error)}</Text>
          <View style={styles.errorDetails}>
            <Text style={styles.errorDetailText}>
              {error instanceof Error && 'status' in error
                ? `Error Code: ${(error as any).status || 'Unknown'}`
                : 'Network or connection issue'}
            </Text>
          </View>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>🔄 Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#3b82f6"
              colors={['#3b82f6']}
            />
          }
        >
          {activeTab === 'posts' ? (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  📊 Loaded {posts?.length || 0} posts from API
                </Text>
                <Text style={styles.infoSubtext}>
                  Pull down to refresh • Cached for 5 minutes
                </Text>
              </View>
              {posts?.map((post) => (
                <View key={post.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardBadge}>#{post.id}</Text>
                    <Text style={styles.cardUserId}>User {post.userId}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <Text style={styles.cardBody} numberOfLines={3}>
                    {post.body}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  👥 Loaded {users?.length || 0} users from API
                </Text>
                <Text style={styles.infoSubtext}>
                  Pull down to refresh • Cached for 10 minutes
                </Text>
              </View>
              {users?.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {user.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userUsername}>@{user.username}</Text>
                    <Text style={styles.userDetail}>📧 {user.email}</Text>
                    <Text style={styles.userDetail}>📱 {user.phone}</Text>
                    <Text style={styles.userDetail}>🌐 {user.website}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Powered by TanStack Query ⚡
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  errorDetails: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorDetailText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardUserId: {
    fontSize: 12,
    color: '#64748b',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  cardBody: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  userCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
