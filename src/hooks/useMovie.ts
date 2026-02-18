import { useQuery } from '@tanstack/react-query';
import { Movie } from './useMovies';

interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  similar: {
    results: Movie[];
  };
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

const fetchMovie = async (id: string): Promise<MovieDetail> => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = new URL(`https://${projectId}.supabase.co/functions/v1/tmdb-proxy`);
  url.searchParams.set('movieId', id);

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });

  if (!response.ok) {
    console.error('Fetch failed:', response.status, response.statusText);
    throw new Error('Failed to fetch movie details');
  }

  const data = await response.json();
  console.log('Movie Details Data:', data);
  return data;
};

export const useMovie = (id: string | undefined) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
