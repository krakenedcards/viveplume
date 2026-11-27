import { biblePages } from './bible.mjs';
import { defineCollection } from 'astro:content';
import { novels, chapters } from './content.mjs';
export const collections = {
  bible: defineCollection({ loader: biblePages }),
  romans: defineCollection({ loader: novels }),
  chapitres: defineCollection({ loader: chapters }),
};
