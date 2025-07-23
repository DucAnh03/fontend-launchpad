import api from '@/services/api/axios';

export interface IProjectOption {
    _id: string;
    name: string;
}

export async function getMyProjects(): Promise<IProjectOption[]> {
    const { data } = await api.get('/projects/my'); 
    return data.data;
}

export interface IProjectMember {
    userId: {
        _id: string;
        name: string;
        username: string;
        avatar?: string;
    };
    role: string;
}

export async function getProjectMembers(projectId: string): Promise<IProjectMember[]> {
    const { data } = await api.get(`/projects/${projectId}`);
    return data.data.members;
} 