import api from '@/services/api/axios';

export interface IProjectOption {
    _id: string;
    name: string;
}

export async function getMyProjects(): Promise<IProjectOption[]> {
    const { data } = await api.get('/projects/user'); // <- trùng router backend
    // backend nên trả { success: true, data: [ { _id, name } ] }
    return data.data;
} 