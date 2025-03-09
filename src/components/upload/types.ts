
import { z } from 'zod';

// Define a schema for publishing info
const publisherInfoSchema = z.object({
  pro: z.string().optional(),
  ipi: z.string().optional(),
  publishingShare: z.union([z.string(), z.number()]).optional(),
  notes: z.string().optional(),
}).optional();

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist name is required'),
  genre: z.string().min(1, 'Genre is required'),
  releaseDate: z.string().min(1, 'Release date is required'),
  distributionServices: z.array(z.string()).min(1, 'Select at least one service'),
  description: z.string().optional(),
  upcCode: z.string().optional(),
  isrcCode: z.string().optional(),
  hasPublishingRights: z.boolean().default(false),
  publisher: z.string().optional(),
  publisherInfo: publisherInfoSchema,
});

export type FormValues = z.infer<typeof formSchema>;

// Define the publisher info type separately for easier access
export type PublisherInfo = {
  pro?: string;
  ipi?: string;
  publishingShare?: string | number;
  notes?: string;
};
