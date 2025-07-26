import axios from '../axios'; // Đảm bảo đường dẫn đến axios instance là đúng

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

export async function createPortfolio(portfolioData: FormData): Promise<IPortfolioItem> {
  const { data } = await axios.post('/portfolio', portfolioData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return data.data; // Backend returns { success: true, data: newPortfolioObject } for creation
}

export async function getAllPortfolios(): Promise<IPortfolioItem[]> {
  try {
    const { data } = await axios.get('/portfolio'); // `data` here is { success: true, count: 3, data: [...] }
    return data.data || []; // Correctly extracts the array of portfolio items
  } catch (error) {
    console.error('Error fetching all portfolios:', error);
    throw error; // Essential to propagate errors for proper frontend handling
  }
}

export async function getPortfolioById(id: string): Promise<IPortfolioItem> {
    const { data } = await axios.get(`/portfolio/${id}`);
    // BASED ON THE BACKEND FOR getAllPortfolioItems, IT'S HIGHLY LIKELY
    // THAT getPortfolioById ALSO RETURNS { success: true, data: singlePortfolio }
    // So, it should probably be `data.data` here too.
    return data.data; // <--- Changed from data.metadata (Please confirm your backend for single item)
}
// Cập nhật một portfolio item
export async function updatePortfolio(id: string, portfolioData: FormData): Promise<IPortfolioItem> {
  const { data } = await axios.put(`/portfolio/${id}`, portfolioData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
}


// Xoá một portfolio item
export async function deletePortfolio(id: string): Promise<{ success: boolean; message: string }> {
  const { data } = await axios.delete(`/portfolio/${id}`);
  return {
    success: data.success,
    message: data.message
  };
}
