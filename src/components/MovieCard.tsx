import { motion } from 'framer-motion';
import type { Movie } from '@/hooks/useMovies';
import { Star } from 'lucide-react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, index }: { movie: Movie; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="group relative rounded-lg overflow-hidden bg-card border border-border cursor-pointer"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-xs text-foreground/80 line-clamp-4">{movie.overview}</p>
        </div>
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold text-foreground truncate">{movie.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{movie.release_date?.split('-')[0]}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
