import { useQuery } from '@tanstack/react-query';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

const fetchMovies = async (category: string, query: string, page: number): Promise<TMDBResponse> => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = new URL(`https://${projectId}.supabase.co/functions/v1/tmdb-proxy`);
  url.searchParams.set('category', category);
  url.searchParams.set('page', String(page));
  if (query) url.searchParams.set('query', query);

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch movies');
  return response.json();
};

export const useMovies = (category: string, query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['movies', category, query, page],
    queryFn: () => fetchMovies(category, query, page),
    staleTime: 5 * 60 * 1000,
  });
};
