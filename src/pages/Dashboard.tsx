import { useState, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import { MovieSkeletonGrid } from '@/components/MovieSkeleton';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'top_rated', label: 'Top Rated', icon: Star },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const Dashboard = () => {
  const [category, setCategory] = useState('popular');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useMovies(category, query, page);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl tracking-wider text-foreground mb-2">
            Discover <span className="text-primary">Movies</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore millions of movies from around the world
          </p>
        </motion.div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id && !query ? 'default' : 'secondary'}
                size="sm"
                onClick={() => {
                  setCategory(cat.id);
                  setSearchInput('');
                  setQuery('');
                  setPage(1);
                }}
                className="gap-1.5"
              >
                <cat.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{cat.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Movie grid */}
        {isLoading ? (
          <MovieSkeletonGrid />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-lg">Failed to load movies. Please try again.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data?.results?.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>

            {data?.results?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No movies found.</p>
              </div>
            )}

            {/* Pagination */}
            {data && data.total_pages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-muted-foreground">
                  Page {page} of {data.total_pages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
