import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState, useEffect } from "react";

interface LikeGameButtonProps {
  game_id: number;
}

const LikeGameButton: React.FC<LikeGameButtonProps> = ({ game_id }) => {
  const [liked, setLiked] = useState(false);
  const { favorite_games, fetchGames, page_games } = useMusicStore();
  const [favoriteGames1, setFavoriteGames1] = useState(new Set<number>());

  useEffect(() => {
    fetchGames(page_games);
    setFavoriteGames1(new Set(favorite_games.map(fav => fav.id)));
  }, [page_games, fetchGames, favorite_games]);

  useEffect(() => {
    setLiked(favoriteGames1.has(game_id));
  }, [favoriteGames1, game_id]);

  const handleLike = async () => {
    const isFav = favoriteGames1.has(game_id);
    const updatedFav = new Set(favoriteGames1);

    if (isFav) {
      updatedFav.delete(game_id);
      await fetch("http://localhost:5000/remove_favorite_games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id }),
      });
    } else {
      updatedFav.add(game_id);
      await fetch("http://localhost:5000/add_favorite_games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id }),
      });
    }

    setFavoriteGames1(updatedFav);
    setLiked(!liked);
  };

  return (
    <Button
      size="icon"
      onClick={handleLike}
      className={`absolute bottom-3 right-2 bg-green-400 hover:bg-green-400 hover:scale-105 transition-all 
      opacity-0 translate-y-2 group-hover:translate-y-0 ${
        liked ||  favoriteGames1.has(game_id)? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {liked ? <Heart className="size-5" /> : <HeartOff className="size-5" />}
    </Button>
  );
};

export default LikeGameButton;
