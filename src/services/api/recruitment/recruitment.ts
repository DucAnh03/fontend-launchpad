import axios from '../axios';

export interface IRecruitmentPost {
    _id: string;
    title: string;
    description: string;
    workspaceId: string;
    projectId?: string;
    leaderId: string;
    requiredSkills: string[];
    experienceLevel: 'junior' | 'mid' | 'senior';
    recruitmentLinkToImages: string[];
    status: 'open' | 'closed';
    deadline?: Date;
    createdAt: string;
    updatedAt: string;
}

/**
 * Get recruitment post by ID
 */
export async function getRecruitmentById(id: string): Promise<IRecruitmentPost> {
    const { data } = await axios.get(`/recruitment-posts/${id}`);
    return data.data;
}

/**
 * Create a new recruitment post
 * @param postData - FormData containing post information and images
 */
export async function createRecruitment(postData: FormData): Promise<IRecruitmentPost> {
    const { data } = await axios.post('/recruitment-posts', postData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return data.data;
} 