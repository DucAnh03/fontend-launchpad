import axios from '../axios'; 

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
}


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
  return data.data || []; 
}
export async function getPortfolioById(id: string): Promise<IPortfolioItem | null> {
    try {
        const { data } = await axios.get(`/portfolio/${id}`);
        return data.data; 
    } catch (error) {
        console.error(`Error fetching portfolio by id ${id}:`, error);
        return null;
    }
}