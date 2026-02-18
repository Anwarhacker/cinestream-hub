import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMovie } from '@/hooks/useMovie';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, Calendar, Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const IMG_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const IMG_BASE_POSTER = 'https://image.tmdb.org/t/p/w500';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialMovie = location.state?.movie;
  
  const { data: fetchedMovie, isLoading, error } = useMovie(id);

  // Use fetched movie if valid, otherwise fallback to initialMovie (with partial data)
  // We consider fetchedMovie valid if it has a vote_average that is undefined (list item)
  const isFetchedDataInvalid = fetchedMovie && (typeof fetchedMovie.vote_average === 'undefined' || !fetchedMovie.title);
  
  const movie = (!isFetchedDataInvalid && fetchedMovie) ? fetchedMovie : initialMovie;
  const isPartialData = !fetchedMovie || isFetchedDataInvalid;

  if (isLoading && !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if ((error || !movie) && !initialMovie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-xl text-destructive">Failed to load movie details.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // No longer blocking on API mismatch, just showing partial data with a warning
  
  const trailer = movie?.videos?.results?.find(
    (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {movie.backdrop_path ? (
          <div className="absolute inset-0">
            <img 
              src={`${IMG_BASE_ORIGINAL}${movie.backdrop_path}`} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            
            {isPartialData && (
               <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 backdrop-blur-md">
                 <AlertTriangle className="h-4 w-4" />
                 <span className="text-sm font-medium">Limited details available. Deploy Edge Function to see full info.</span>
               </div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-end"
            >
              {/* Poster (hidden on mobile, shown on desktop) */}
              <div className="hidden md:block rounded-xl overflow-hidden shadow-2xl skew-y-0 transform hover:scale-105 transition-transform duration-500 ring-1 ring-white/10">
                <img 
                  src={`${IMG_BASE_POSTER}${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Info */}
              <div className="space-y-6">
                <Button 
                  variant="ghost" 
                  className="mb-4 text-white/80 hover:text-white hover:bg-white/10 group pl-0" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
                
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {movie.title}
                  </h1>
                   {movie.tagline && <p className="text-xl text-gray-300 italic font-light">{movie.tagline}</p>}
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
                  <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-white tracking-wide">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="text-xs text-white/50">/ 10</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{movie.runtime || '?'} min</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((g) => (
                    <span key={g.id} className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-sm text-white border border-white/10 transition-colors">
                      {g.name}
                    </span>
                  ))}
                </div>

                {trailer && (
                  <Button 
                    size="lg"
                    className="mt-6 gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-8"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Watch Trailer
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Mobile Poster & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="md:hidden max-w-[200px] mx-auto rounded-lg overflow-hidden shadow-xl">
            <img 
              src={`${IMG_BASE_POSTER}${movie.poster_path}`} 
              alt={movie.title}
              className="w-full h-auto"
            />
          </div>
          <div className="md:col-start-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>

            {/* Cast */}
            {movie.credits?.cast?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-foreground border-l-4 border-primary pl-4">Top Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {movie.credits.cast.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                      <div className="aspect-[2/3] overflow-hidden bg-secondary relative">
                        {actor.profile_path ? (
                          <img 
                            src={`${IMG_BASE_POSTER}${actor.profile_path}`} 
                            alt={actor.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                             <span className="text-4xl font-bold opacity-20">{actor.name[0]}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm text-foreground truncate">{actor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Movies */}
        {movie.similar?.results?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.similar.results.slice(0, 5).map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
