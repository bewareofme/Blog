// types.ts
export interface BlogPost {
    [x: string]: any;
    id: string;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    coverImage?: string;
    tags: string[];
    publishedAt: Date | string;
    author?: {
      name: string;
      avatar?: string;
      email?:string
    };
  }
  
  export interface BlogPageProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
  }

  export interface BlogPostResponse {
    data?: BlogPost;
    message?: string;
    error?: string;
  }