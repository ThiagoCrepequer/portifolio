type Post = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  created_at: string;
  updated_at: string;
  category: string;
  tags: string[];
};
