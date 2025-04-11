// validation.ts
import * as yup from 'yup';

export const blogPostSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(100, 'Title is too long'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: yup.string().required('Excerpt is required').max(200, 'Excerpt is too long'),
  content: yup.string().required('Content is required'),
  tags: yup.array().of(yup.string().max(20, 'Tag is too long')),
});