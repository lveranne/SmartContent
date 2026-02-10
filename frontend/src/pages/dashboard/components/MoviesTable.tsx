import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Eye, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Movie } from "@/types";

const MovieTable = () => {
    const {
        movies,
        isLoading,
		favorite_movies,
        error,
        fetchMovies,
        page_movies,
        total_movies,
        per_page_movies,
        nextPageMovies,
        prevPageMovies,
    } = useMusicStore();

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [favoriteMovies, setFavoriteMovies] = useState(new Set());
	const [favoriteMovies1, setFavoriteMovies1] = useState(new Set());

    useEffect(() => {
        fetchMovies(page_movies);
		setFavoriteMovies1(new Set(favorite_movies.map(fav => fav.id)));
    }, [page_movies, fetchMovies, setFavoriteMovies1, favorite_movies]);

    const handleOpenDialog = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsDialogOpen(true);
    };

    const toggleFavorite = async (movie_id : number) => {
		const isFavorite = favoriteMovies.has(movie_id);
		const isfav = favorite_movies.some(fav => fav.id === movie_id)

		// Partir de l'état actuel
		const updatedFavorites = new Set(favoriteMovies);
		const updatedFav = new Set(favoriteMovies1);
	
		if (isFavorite || isfav) {
			updatedFavorites.delete(movie_id);
        	updatedFav.delete(movie_id);

			await fetch("http://localhost:5000/remove_favorite_movies", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ movie_id }),
			});
		} else {
			updatedFavorites.add(movie_id);
        	updatedFav.add(movie_id);
			await fetch("http://localhost:5000/add_favorite_movies", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ movie_id }),
			});
		}
		setFavoriteMovies(updatedFavorites);
		setFavoriteMovies1(updatedFav);
	};

    if (isLoading) {
        return <div className='flex items-center justify-center py-8'><div className='text-zinc-400'>Loading movies...</div></div>;
    }

    if (error) {
        return <div className='flex items-center justify-center py-8'><div className='text-red-400'>{error}</div></div>;
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className='hover:bg-zinc-800/50'>
                        <TableHead className='w-[50px]'></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Genres</TableHead>
                        <TableHead>Release Date</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {movies.map((movie, idx) => (
                        <TableRow key={idx} className='hover:bg-zinc-800/50'>
                            <TableCell>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='size-10 rounded object-cover' />
                            </TableCell>
                            <TableCell className='font-medium'>{movie.title}</TableCell>
                            <TableCell>{movie.translated_genres.join(", ")}</TableCell>
                            <TableCell>
                                <span className='inline-flex items-center gap-1 text-zinc-400'>
                                    <Calendar className='h-4 w-4' />
                                    {movie.release_date}
                                </span>
                            </TableCell>
                            <TableCell className='text-right'>
                                <div className='flex gap-2 justify-end'>
                                    <Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        className='text-orange-500 hover:text-orange-400 hover:bg-blue-400/10'
                                        onClick={() => handleOpenDialog(movie)}
                                    >
                                        <Eye className='size-4' />
                                    </Button>
									<Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={() => toggleFavorite(movie.id)}
                                    >
                                        <Heart className={ favoriteMovies1.has(movie.id)? "text-emerald-400 fill-emerald-400 size-4" : "text-zinc-400 size-4"}  />
                                	</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className='flex justify-between items-center mt-4'>
                <Button disabled={page_movies === 1} onClick={prevPageMovies} variant='outline'>
                    Previous
                </Button>
                <span className='text-white'>
                    Page {page_movies} of {Math.ceil(total_movies / per_page_movies)}
                </span>
                <Button disabled={page_movies * per_page_movies >= total_movies} onClick={nextPageMovies} variant='outline'>
                    Next
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-zinc-900 text-white'>
                    {selectedMovie && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedMovie.title}</DialogTitle>
                                <DialogDescription className='text-zinc-400'>{selectedMovie.overview}</DialogDescription>
                            </DialogHeader>
                            <div className='flex gap-4'>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                                    alt={selectedMovie.title}
                                    className='size-60 rounded object-cover'
                                />
                                <div className='flex flex-col gap-2'>
                                    <p className='text-zinc-400'><strong className="text-white">Original Language:</strong> {selectedMovie.original_language}</p>
                                    <p className='text-zinc-400'><strong className="text-white">Genres:</strong> {selectedMovie.translated_genres.join(", ")}</p>
                                    <p className='text-zinc-400'><strong className="text-white">Release Date:</strong> {selectedMovie.release_date}</p>
                                    <p className='text-zinc-400'><strong className="text-white">Rating:</strong> {selectedMovie.vote_average.toFixed(1)} ⭐</p>
                                </div>

                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MovieTable;
