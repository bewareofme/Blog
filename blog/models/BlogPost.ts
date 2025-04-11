import mongoose,{ Schema, model, Document, Types, } from 'mongoose';

// Define the Author subdocument schema
interface IAuthor {
  name: string;
  avatar?: string;
  email?:string
}

// Define the main BlogPost interface extending Mongoose Document
interface IBlogPost extends Document {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  tags: string[];
  publishedAt: Date;
  author?: IAuthor;
}

// Create the Mongoose Schema
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    author: {
      name: { type: String },
      avatar: { type: String },
      email:{ type: String }
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Add text index for search functionality
BlogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Create and export the model
// export const BlogPost = model<IBlogPost>('BlogPost', BlogPostSchema);
// export default BlogPost;

// module.exports=mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)
export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);