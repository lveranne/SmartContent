import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState, useEffect } from "react";

interface LikeGameButtonProps {
  movie_id: number;
}

const LikeMovieButton: React.FC<LikeGameButtonProps> = ({ movie_id }) => {
  const [liked, setLiked] = useState(false);
  const { favorite_movies, fetchMovies, page_movies } = useMusicStore();
  const [favoriteMovies1, setFavoriteMovies1] = useState(new Set<number>());

  useEffect(() => {
    fetchMovies(page_movies);
    setFavoriteMovies1(new Set(favorite_movies.map(fav => fav.id)));
    }, [page_movies, fetchMovies, setFavoriteMovies1, favorite_movies]);

  useEffect(() => {
    setLiked(favoriteMovies1.has(movie_id));
  }, [favoriteMovies1, movie_id]);

  const handleLike = async () => {
    const isFav = favoriteMovies1.has(movie_id);
    const updatedFav = new Set(favoriteMovies1);

    if (isFav) {
      updatedFav.delete(movie_id);

        // Mise à jour immédiate de l'état local en filtrant le film supprimé
      useMusicStore.setState((state) => ({
        favorite_movies: state.favorite_movies.filter((movie) => movie.id !== movie_id),
      }));

      await fetch("http://localhost:5000/remove_favorite_movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id }),
      });

    } else {  
      updatedFav.add(movie_id);
      await fetch("http://localhost:5000/add_favorite_movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id }),
      });
    }

    setFavoriteMovies1(updatedFav);
    setLiked(!liked);
  };

  return (
    <Button
      size="icon"
      onClick={handleLike}
      className={`absolute bottom-3 right-2 bg-green-400 hover:bg-green-400 hover:scale-105 transition-all 
      opacity-0 translate-y-2 group-hover:translate-y-0 ${
        liked ||  favoriteMovies1.has(movie_id)? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {liked ? <Heart className="size-5" /> : <HeartOff className="size-5" />}
    </Button>
  );
};

export default LikeMovieButton;
