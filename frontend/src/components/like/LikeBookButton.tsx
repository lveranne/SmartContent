import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useState, useEffect } from "react";

interface LikeGameButtonProps {
  book_id: string;
  title : string;
	authors: string;
	published : string;
	language : string;
  genre: string;
  cover: string;   
	link: string; 
}

const LikeBookButton: React.FC<LikeGameButtonProps> = ({ book_id, title, authors, published, language, genre, cover, link  }) => {
  const [liked, setLiked] = useState(false);
  const { favorite_books, fetchBooks, page_books } = useMusicStore();
  const [favoriteBooks1, setFavoriteBooks1] = useState(new Set<string>());

  useEffect(() => {
    fetchBooks(page_books);
    setFavoriteBooks1(new Set(favorite_books.map(fav => fav.id)));
    }, [page_books, fetchBooks, setFavoriteBooks1, favorite_books]);

  useEffect(() => {
    setLiked(favoriteBooks1.has(book_id));
  }, [favoriteBooks1, book_id]);

  const handleLike = async () => {
    const isFav = favoriteBooks1.has(book_id);
    const updatedFav = new Set(favoriteBooks1);

    if (isFav) {
      updatedFav.delete(book_id);
      await fetch("http://localhost:5000/remove_favorite_books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id }),
      });
    } else {
      updatedFav.add(book_id);
      await fetch("http://localhost:5000/add_favorite_books_google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id, title, authors, published, language, genre, cover, link }),
      });
    }

    setFavoriteBooks1(updatedFav);
    setLiked(!liked);
  };

  return (
    <Button
      size="icon"
      onClick={handleLike}
      className={`absolute bottom-3 right-2 bg-green-400 hover:bg-green-400 hover:scale-105 transition-all 
      opacity-0 translate-y-2 group-hover:translate-y-0 ${
        liked ||  favoriteBooks1.has(book_id)? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {liked ? <Heart className="size-5" /> : <HeartOff className="size-5" />}
    </Button>
  );
};

export default LikeBookButton;
