import apiClient from './interceptor';

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
}

export const api = {
    getPosts: async (): Promise<Post[]> => {
        return apiClient.get<Post[]>('/posts?_limit=10', {
            timeout: 10000,
            retries: 2,
        });
    },

    getPost: async (id: number): Promise<Post> => {
        return apiClient.get<Post>(`/posts/${id}`);
    },

    getUsers: async (): Promise<User[]> => {
        return apiClient.get<User[]>('/users?_limit=5', {
            timeout: 10000,
            retries: 2,
        });
    },

    createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
        return apiClient.post<Post>('/posts', post);
    },

    updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
        return apiClient.put<Post>(`/posts/${id}`, post);
    },

    deletePost: async (id: number): Promise<void> => {
        return apiClient.delete<void>(`/posts/${id}`);
    },
};
