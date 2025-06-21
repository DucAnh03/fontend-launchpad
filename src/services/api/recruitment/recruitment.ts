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
} export async function listRecruitmentPosts(params?: Record<string, any>) {
    const { data } = await axios.get('/recruitment-posts/all', { params });
    return data.data as IRecruitmentPost[];
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

/**
 * Apply for a recruitment post
 * @param postId - ID of the recruitment post
 * @param applicationData - Application data (CV, cover letter, etc.)
 */
export async function applyForRecruitment(postId: string, applicationData: FormData): Promise<any> {
    // TODO: Replace with actual API endpoint when backend is ready
    // const { data } = await axios.post(`/recruitment-posts/${postId}/apply`, applicationData, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     }
    // });
    // return data;

    // Temporary mock response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Application submitted successfully' });
        }, 1000);
    });
} 