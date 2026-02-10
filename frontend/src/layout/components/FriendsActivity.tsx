import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Star, Users } from "lucide-react";
import { useEffect } from "react";
import LikeGameButton from "@/components/like/LikeGameButton";
import LikeMovieButton from "@/components/like/LikeMovieButton";
import LikeBookButton from "@/components/like/LikeBookButton";
import LikeMusicButton from "@/components/like/LikeMusicButton";

// Fonction pour afficher des étoiles basées sur la popularité
const renderStars = (popularity: number) => {
  const roundedPopularity = popularity % 1 >= 0.5 ? Math.ceil(popularity) : Math.floor(popularity);

  const fullStars = Math.floor(roundedPopularity);
  const emptyStars = 5 - fullStars;

  const stars = [
    ...Array(fullStars).fill("full"),
    ...Array(emptyStars).fill("empty"),
  ];

  return (
    <div className="flex items-center">
      {stars.map((type, index) => {
        if (type === "full") {
          return <Star key={index} className="text-yellow-500 fill-current text-xs" />;
        } else {
          return <Star key={index} className="text-zinc-400 text-xs" />;
        }
      })}
      <span className="ml-2 text-sm text-gray-500">{popularity.toFixed(1)}</span>
    </div>
  );
};

const renderStars1 = (popularity: number) => {
  const scaledRating = (popularity / 10) * 5;
  const roundedPopularity = scaledRating  % 1 >= 0.5 ? Math.ceil(scaledRating ) : Math.floor(scaledRating );

  const fullStars = Math.floor(roundedPopularity);
  const emptyStars = 5 - fullStars;

  const stars = [
    ...Array(fullStars).fill("full"),
    ...Array(emptyStars).fill("empty"),
  ];

  return (
    <div className="flex items-center">
      {stars.map((type, index) => {
        if (type === "full") {
          return <Star key={index} className="text-yellow-500 fill-current text-xs" />;
        } else {
          return <Star key={index} className="text-zinc-400 text-xs" />;
        }
      })}
      <span className="ml-2 text-sm text-gray-500">{scaledRating.toFixed(1)}</span>
    </div>
  );
};


const FriendsActivity = () => {
  const { fetchUsers, recommendation_game, recommendation_book,recommendation_movie,recommendation_music,selectedUser } = useChatStore();
  const { user } = useUser();

  const GamesActivity = () => (
    <div className="p-4 space-y-4">
      {recommendation_game.map((g, idx) => (
        <div
          key={idx}
          className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
        >
          <div className="relative mb-4">
            <div className="aspect-square rounded-md shadow-lg overflow-hidden w-full h-40">
              <img
                src={g.background_image}
                alt={g.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <LikeGameButton game_id={g.id} />
          </div>
          <h3 className="font-medium mb-2 truncate">{g.title}</h3>
          <div className="text-sm text-zinc-400">
            <strong>Release Date:</strong> {g.release_date}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Platforms:</strong> {g.platforms}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Genres:</strong> {g.genres}
          </div>

          <div className="flex gap-1 mt-2">
            {renderStars(g.rating)}
          </div>
        </div>
      ))}
    </div>
  );

  const MusicActivity = () => (
    <div className="p-4 space-y-4">
      {recommendation_music.map((g, idx) => (
        <div
          key={idx}
          className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
        >
          <div className="relative mb-4">
            <div className="aspect-square rounded-md shadow-lg overflow-hidden w-full h-40">
              <img
                src={g.album_image}
                alt={g.track_name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <LikeMusicButton music_id={g.id} track_name={g.track_name} artist_name={g.artist_name} genres={g.genres} playcount={g.playcount} album_image={g.album_image} audio_url={g.audio_url} />
          </div>
          <h3 className="font-medium mb-2 truncate">{g.track_name}</h3>

          <div className="text-sm text-zinc-400">
            <strong>Artists:</strong> {g.artist_name}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Genres:</strong> {g.genres.join(", ") || "none"}
          </div>

          <div className="flex gap-1 mt-2">
              <HeadphonesIcon className="mr-2" />
              {g.playcount}.M
          </div>
        </div>
      ))}
    </div>
  );

  const BooksActivity = () => (
    <div className="p-4 space-y-4">
      {recommendation_book.map((g, idx) => (
        <div
          key={idx}
          className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
        >
          <div className="relative mb-4">
            <div className="aspect-square rounded-md shadow-lg overflow-hidden w-full h-40">
              <img
                src={g.cover}
                alt={g.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <LikeBookButton book_id={g.id} title={g.title} authors={g.authors} published={g.published} language={g.language} genre={g.genre} cover={g.cover} link={g.link} />
          </div>
          <h3 className="font-medium mb-2 truncate">{g.title}</h3>
          <div className="text-sm text-zinc-400">
            <strong>Language:</strong> {g.language}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Genres:</strong> {g.genre}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Authors:</strong> {g.authors}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Published Date:</strong> {g.published}
          </div>
        </div>
      ))}
    </div>
  );

  const MoviesActivity = () => (
    <div className="p-4 space-y-4">
      {recommendation_movie.map((g, idx) => (
        <div
          key={idx}
          className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
        >
          <div className="relative mb-4">
            <div className="aspect-square rounded-md shadow-lg overflow-hidden w-full h-40">
              <img
                src={`https://image.tmdb.org/t/p/w500${g.poster_path}`}
                alt={g.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <LikeMovieButton movie_id={g.id} />
          </div>
          <h3 className="font-medium mb-2 truncate">{g.title}</h3>
          <div className="text-sm text-zinc-400">
            <strong>Original Language:</strong> {g.original_language}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Genres:</strong> {g.translated_genres.join(", ")}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Release Date:</strong> {g.release_date}
          </div>

          <div className="text-sm text-zinc-400">
            <strong>Overview:</strong> {g.overview}
          </div>
          <div className="flex gap-1 mt-2">
            {renderStars1(g.vote_average)}
          </div>

        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">Your Recommendation there</h2>
        </div>
      </div>


      <ScrollArea className="flex-1">
        {selectedUser ? (
          // Afficher soit des jeux ou de la musique selon `selectedUser` et la catégorie
          selectedUser._id  === "gamesbot" ? (
            <>
              {!recommendation_game || recommendation_game.length === 0 && <LoginPrompt />}
              <GamesActivity />
            </>
          ) : selectedUser._id  === "musicbot" ? (
            <>
              {!recommendation_music|| recommendation_music.length === 0 && <LoginPrompt />}
              <MusicActivity />
            </>
          ) : selectedUser._id  === "moviesbot" ? (
            <>
              {!recommendation_movie|| recommendation_movie.length === 0 && <LoginPrompt />}
              <MoviesActivity />
            </>    
          ) : selectedUser._id  === "booksbot" ? (
            <>
              {!recommendation_book|| recommendation_book.length === 0 && <LoginPrompt />}
              <BooksActivity />
            </>    
          ) : (
            <LoginPrompt />
          )
        ) : (
          <LoginPrompt />
        )}
      </ScrollArea>
    </div>
  );
};

export default FriendsActivity;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full p-4">
        <HeadphonesIcon className="size-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">See What Match the best to your preference</h3>
      <p className="text-sm text-zinc-400">Chat with our bot to discover what movies, games, music, and books you would enjoy.</p>
    </div>
  </div>
);
