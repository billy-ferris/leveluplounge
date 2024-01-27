import { z } from "zod";

const ratingSchema = z.object({
  id: z.number(),
  title: z.string(),
  count: z.number(),
  percent: z.number(),
});

const platformSchema = z.object({
  platform: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    image: z.string().nullable(),
    year_end: z.number().nullable(),
    year_start: z.number().nullable(),
    games_count: z.number(),
    image_background: z.string(),
  }),
  released_at: z.string(),
  requirements_en: z
    .object({
      minimum: z.string(),
      recommended: z.string(),
    })
    .nullable(),
  requirements_ru: z
    .object({
      minimum: z.string(),
      recommended: z.string(),
    })
    .nullable(),
});

const storeSchema = z.object({
  id: z.number(),
  store: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    domain: z.string(),
    games_count: z.number(),
    image_background: z.string(),
  }),
});

const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  language: z.string(),
  games_count: z.number(),
  image_background: z.string(),
});

const esrbRatingSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

const shortScreenshotSchema = z.object({
  id: z.number(),
  image: z.string(),
});

const gameSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string(),
  rating: z.number(),
  rating_top: z.number(),
  ratings: z.array(ratingSchema),
  ratings_count: z.number(),
  reviews_text_count: z.number(),
  added: z.number(),
  added_by_status: z.object({
    yet: z.number(),
    owned: z.number(),
    beaten: z.number(),
    toplay: z.number(),
    dropped: z.number(),
    playing: z.number(),
  }),
  metacritic: z.number(),
  playtime: z.number(),
  suggestions_count: z.number(),
  updated: z.string(),
  user_game: z.string().nullable(),
  reviews_count: z.number(),
  saturated_color: z.string(),
  dominant_color: z.string(),
  platforms: z.array(platformSchema),
  parent_platforms: z.array(
    z.object({
      platform: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
      }),
    }),
  ),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      games_count: z.number(),
      image_background: z.string(),
    }),
  ),
  stores: z.array(storeSchema),
  clip: z.string().nullable(),
  tags: z.array(tagSchema),
  esrb_rating: esrbRatingSchema,
  short_screenshots: z.array(shortScreenshotSchema),
});

const gamesResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(gameSchema),
});

export { gamesResponseSchema };
