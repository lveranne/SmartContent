import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Monitor, Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Game } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const GameTable = () => {
	const {
		games,
		isLoading,
		favorite_games,
		error,
		fetchGames,
		page_games,
		total_games,
		per_page_games,
		nextPageGames,
		prevPageGames,
	} = useMusicStore();

	const [selectedGame, setSelectedGame] = useState<Game  | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [favoriteGames, setFavoriteGames] = useState(new Set());
	const [favoriteGames1, setFavoriteGames1] = useState(new Set());

	useEffect(() => {
		fetchGames(page_games);
		setFavoriteGames1(new Set(favorite_games.map(fav => fav.id)));
	}, [page_games, fetchGames, setFavoriteGames1, favorite_games]);

	// Fonction pour ouvrir la boîte de dialogue avec les infos du film sélectionné
	const handleOpenDialog = (game: Game) => {
			setSelectedGame(game);
			setIsDialogOpen(true);
	};

	const toggleFavorite = async (game_id : number) => {
		const isFavorite = favoriteGames.has(game_id);
		const isfav = favorite_games.some(fav => fav.id === game_id)

		// Partir de l'état actuel
		const updatedFavorites = new Set(favoriteGames);
		const updatedFav = new Set(favoriteGames1);
	
		if (isFavorite || isfav) {
			updatedFavorites.delete(game_id);
        	updatedFav.delete(game_id);

			await fetch("http://localhost:5000/remove_favorite_games", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ game_id  }),
			});
		} else {
			updatedFavorites.add(game_id );
        	updatedFav.add(game_id);
			await fetch("http://localhost:5000/add_favorite_games", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ game_id  }),
			});
		}
		setFavoriteGames(updatedFavorites);
		setFavoriteGames1(updatedFav);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading games...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-zinc-800/50'>
						<TableHead className='w-[50px]'></TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Genres</TableHead>
						<TableHead>Platform</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{games.map((game, idx) => (
						<TableRow key={idx} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={game.background_image} alt={game.title} className='size-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{game.title}</TableCell>
							<TableCell>{game.genres}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Monitor className='h-4 w-4' />
									{game.platforms}
								</span>
							</TableCell>

							
							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant={"ghost"}
										size={"sm"}
										className='text-red-500 hover:text-red-400 hover:bg-blue-400/10'
										onClick={() => handleOpenDialog(game)}
									>
										<Eye className='size-4' />
									</Button>
									<Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={() => toggleFavorite(game.id)}
                                    >
                                        <Heart className={ favoriteGames1.has(game.id)? "text-emerald-400 fill-emerald-400 size-4" : "text-zinc-400 size-4"}  />
                                	</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination Controls */}
			<div className='flex justify-between items-center mt-4'>
				<Button
					disabled={page_games === 1}
					onClick={prevPageGames}
					variant='outline'
				>
					Previous
				</Button>
				<span className='text-white'>
					Page {page_games} of {Math.ceil(total_games / per_page_games)}
				</span>
				<Button
					disabled={page_games * per_page_games >= total_games}
					onClick={nextPageGames}
					variant='outline'
				>
					Next
				</Button>
			</div>

			{/* Boîte de dialogue avec les détails du film */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='bg-zinc-900 text-white'>
					{selectedGame && (
						<>
							<DialogHeader>
								<DialogTitle>{selectedGame.title}</DialogTitle>
								<DialogDescription className='text-zinc-400'>{selectedGame.release_date}</DialogDescription>
							</DialogHeader>
							<div className='flex gap-4'>
								<img
									src={selectedGame.background_image}
									alt={selectedGame.title}
									className='size-60 rounded object-cover'
								/>
								<div className='flex flex-col gap-2'>
									<p className='text-zinc-400'><strong className="text-white">Genres:</strong> {selectedGame.genres}</p>
									<p className='text-zinc-400'><strong className="text-white">Platform :</strong> {selectedGame.platforms}</p>
									<p className='text-zinc-400'><strong className="text-white">Rating:</strong> {selectedGame.rating}⭐</p>
								</div>
							</div>

						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default GameTable;
