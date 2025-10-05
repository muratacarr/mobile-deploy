import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Post } from '../api/client';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: api.getPosts,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => api.getPost(id),
    enabled: !!id,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
