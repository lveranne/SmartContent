import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState, useEffect } from "react";

interface LikeGameButtonProps {
  music_id: number;
  track_name: string;
  artist_name: string;
  genres: string;
  playcount: number;
  album_image: string;
  audio_url: string;
}

const LikeMusicButton: React.FC<LikeGameButtonProps> = ({ music_id, track_name, artist_name, genres, playcount, album_image, audio_url }) => {
  const [liked, setLiked] = useState(false);
  const { favorite_musics, fetchSongs, page_songs } = useMusicStore();
  const [favoriteMusics1, setFavoriteMusics1] = useState(new Set<number>());

  useEffect(() => {
    fetchSongs(page_songs);
    setFavoriteMusics1(new Set(favorite_musics.map(fav => fav.id)));
}, [page_songs, fetchSongs, setFavoriteMusics1, favorite_musics]);

  useEffect(() => {
    setLiked(favoriteMusics1.has(music_id));
  }, [favoriteMusics1, music_id]);

  const handleLike = async () => {
    const isFav = favoriteMusics1.has(music_id);
    const updatedFav = new Set(favoriteMusics1);

    if (isFav) {
      updatedFav.delete(music_id);
      await fetch("http://localhost:5000/remove_favorite_musics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ music_id }),
      });
    } else {
      updatedFav.add(music_id);
      await fetch("http://localhost:5000/add_favorite_musics_spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ music_id, track_name, artist_name, genres, playcount, album_image, audio_url}),
      });
    }

    setFavoriteMusics1(updatedFav);
    setLiked(!liked);
  };

  return (
    <Button
      size="icon"
      onClick={handleLike}
      className={`absolute bottom-3 right-2 bg-green-400 hover:bg-green-400 hover:scale-105 transition-all 
      opacity-0 translate-y-2 group-hover:translate-y-0 ${
        liked ||  favoriteMusics1.has(music_id)? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {liked ? <Heart className="size-5" /> : <HeartOff className="size-5" />}
    </Button>
  );
};

export default LikeMusicButton;
