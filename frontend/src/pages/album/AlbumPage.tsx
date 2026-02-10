import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Movie, Music, Book, Game } from "@/types";
import { useMusicStore } from "@/stores/useMusicStore";

const AlbumPage = () => {
	const { albumId } = useParams();

	const {
		favorite_movies,
		favorite_musics,
		favorite_books,
		favorite_games,
		fetchFavoriteMovies,
		fetchFavoriteMusics,
		fetchFavoriteGames,
		fetchFavoriteBooks,
	} = useMusicStore();

	useEffect(() => {
		fetchFavoriteMovies();
		fetchFavoriteMusics();
		fetchFavoriteGames();
		fetchFavoriteBooks();
	}, [fetchFavoriteMovies, fetchFavoriteMusics, fetchFavoriteGames, fetchFavoriteBooks]);

	// Albums disponibles
	const albums = [
		{ _id: '1', title: "Favorite Musics", imageUrl: "/albums/1.jpg" },
		{ _id: '2', title: "Favorite Movies", imageUrl: "/albums/2.jpg" },
		{ _id: '3', title: "Favorite Books", imageUrl: "/albums/3.jpg" },
		{ _id: '4', title: "Favorite Games", imageUrl: "/albums/4.jpg" },
	];

	const handleDeleteMovie = async (movie_id: number) => {
		// Mise à jour immédiate de l'état local en filtrant le film supprimé
		useMusicStore.setState((state) => ({
			favorite_movies: state.favorite_movies.filter((movie) => movie.id !== movie_id),
		}));
	
		// Envoi de la requête au backend
		await fetch("http://localhost:5000/remove_favorite_movies", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ movie_id }),
		});
	
		// Rafraîchir les favoris depuis le backend (optionnel)
		await fetchFavoriteMovies();
	};

	const handleDeleteMusic = async (music_id: number) => {
		// Mise à jour immédiate de l'état local en filtrant le film supprimé
		useMusicStore.setState((state) => ({
			favorite_musics: state.favorite_musics.filter((music) => music.id !== music_id),
		}));
	
		// Envoi de la requête au backend
		await fetch("http://localhost:5000/remove_favorite_musics", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ music_id }),
		});
	
		// Rafraîchir les favoris depuis le backend (optionnel)
		await fetchFavoriteMusics();
	};

	const handleDeleteBook = async (book_id: string) => {
		// Mise à jour immédiate de l'état local en filtrant le film supprimé
		useMusicStore.setState((state) => ({
			favorite_books: state.favorite_books.filter((book) => book.id !== book_id),
		}));
	
		// Envoi de la requête au backend
		await fetch("http://localhost:5000/remove_favorite_books", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ book_id }),
		});
	
		// Rafraîchir les favoris depuis le backend (optionnel)
		await fetchFavoriteBooks();
	};
	
	const handleDeleteGame = async (game_id: number) => {
		// Mise à jour immédiate de l'état local en filtrant le film supprimé
		useMusicStore.setState((state) => ({
			favorite_games: state.favorite_games.filter((game) => game.id !== game_id),
		}));
	
		// Envoi de la requête au backend
		await fetch("http://localhost:5000/remove_favorite_games", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ game_id }),
		});
	
		// Rafraîchir les favoris depuis le backend (optionnel)
		await fetchFavoriteMusics();
	};


	const currentAlbum = albumId ? albums.find((album) => album._id === albumId) : undefined;

	// Fonction pour afficher les éléments d'un album
	const renderContent = () => {
		switch (currentAlbum?.title) {
			case "Favorite Movies":
				return favorite_movies.length > 0 ? (
					favorite_movies.map((movie: Movie, index) => (
						<div key={index} className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 border-b border-white/10 text-white'>
							<div>{index + 1}</div>
							<div>{movie.title}</div>
							<div>{movie.release_date || "N/A"}</div>
							<div>
								<Button onClick={() => handleDeleteMovie(movie.id)} size='sm' variant='ghost' className="text-red-500">
									<Trash2 className="text-red-500"/>
								</Button>
							</div>
						</div>
					))
				) : (
					<p className="text-center py-4 text-gray-400">No favorite movies found.</p>
				);

			case "Favorite Musics":
				return favorite_musics.length > 0 ? (
					favorite_musics.map((music: Music, index) => (
						<div key={index} className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 border-b border-white/10 text-white'>
							<div>{index + 1}</div>
							<div>{music.track_name}</div>
							<div>{music.playcount.toFixed(1)}k</div>
							<div>
								<Button onClick={() => handleDeleteMusic(music.id)} size='sm' variant='ghost' className="text-red-500">
									<Trash2 className="text-red-500"/>
								</Button>
							</div>
						</div>
					))
				) : (
					<p className="text-center py-4 text-gray-400">No favorite musics found.</p>
				);

			case "Favorite Books":
				return favorite_books.length > 0 ? (	
					favorite_books.map((book: Book, index) => (
						<div key={index} className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 border-b border-white/10 text-white'>
							<div>{index + 1}</div>
							<div>{book.title}</div>
							<div>{book.published || "N/A"}</div>
							<div>
								<Button onClick={() => handleDeleteBook(book.id)}  size='sm' variant='ghost' className="text-red-500">
									<Trash2 className="text-red-500"/>
								</Button>
							</div>
						</div>
					))			
				) : (
					<p className="text-center py-4 text-gray-400">No favorite books found.</p>
				);

			case "Favorite Games":
				return favorite_games.length > 0 ? (
					favorite_games.map((game: Game, index) => (
						<div key={index} className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 border-b border-white/10 text-white'>
							<div>{index + 1}</div>
							<div>{game.title}</div>
							<div>{game.release_date || "N/A"}</div>
							<div>
								<Button onClick={() => handleDeleteGame(game.id)}  size='sm' variant='ghost' className="text-red-500">
									<Trash2 className="text-red-500"/>
								</Button>
							</div>
						</div>
					))
				) : (
					<p className="text-center py-4 text-gray-400">No favorite games found.</p>
				);

			default:
				return <p className="text-center py-4 text-gray-400">No favorites found.</p>;
		}
	};

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none' aria-hidden='true' />

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							<img src={currentAlbum?.imageUrl} alt={currentAlbum?.title} className='w-[500px] h-[350px] shadow-xl rounded' />
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='text-5xl font-bold my-4'>{currentAlbum?.title}</h1>
							</div>
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
							{/* Table header */}
							<div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
								<div>#</div>
								<div>Title</div>
								<div><Clock className='h-4 w-4' /></div>
								<div>Actions</div>
								
							</div>

							{/* Contenu dynamique */}
							{renderContent()}
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default AlbumPage;
