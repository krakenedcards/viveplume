import { defineCollection } from 'astro:content';
import { novels, chapters } from './content.mjs';
export const collections = {
  romans: defineCollection({ loader: novels }),
  chapitres: defineCollection({ loader: chapters }),
};
