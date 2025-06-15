import axios from '../axios'; // Đảm bảo đường dẫn đến axios instance là đúng

// Interface cho dữ liệu trả về (có thể không cần nếu chỉ post)
export interface IPortfolioItem {
  _id: string;
  title: string;
  summary: string;
  description: string;
  coverImage: { url: string; altText: string; };
  lessonsLearned?: string;
  myRole: string;
  technologies: string[];
  gallery?: { url: string; caption: string; }[];
  liveUrl?: string;
  sourceCodeUrl?: string;
  // ... các trường khác
}

/**
 * Tạo một mục portfolio mới
 * @param portfolioData - Dữ liệu dạng FormData
 */
export async function createPortfolio(portfolioData: FormData): Promise<IPortfolioItem> {
  const { data } = await axios.post('/portfolio', portfolioData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return data.data;
}

export async function getAllPortfolios(): Promise<IPortfolioItem[]> {
  const { data } = await axios.get('/portfolio');
  return data.data || []; // Giả sử backend trả về { data: [...] }
}
export async function getPortfolioById(id: string): Promise<IPortfolioItem> {
    const { data } = await axios.get(`/portfolio/${id}`);
    return data.metadata; 
}