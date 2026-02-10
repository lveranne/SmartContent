import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { HeadphonesIcon, Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Music } from "@/types";

const SongsTable = () => {
	const {
		music,
		isLoading,
		favorite_musics,
		error,
		fetchSongs,
		page_songs,
		total_songs,
		per_page_songs,
		nextPageSongs,
		prevPageSongs,
	} = useMusicStore();

	const [selectedMusic, setSelectedMusic] = useState<Music  | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [favoriteMusics, setFavoriteMusics] = useState(new Set());
	const [favoriteMusics1, setFavoriteMusics1] = useState(new Set());

	useEffect(() => {
		fetchSongs(page_songs);
		setFavoriteMusics1(new Set(favorite_musics.map(fav => fav.id)));
	}, [page_songs, fetchSongs, setFavoriteMusics1, favorite_musics]);

	// Fonction pour ouvrir la boîte de dialogue avec les infos du film sélectionné
	const handleOpenDialog = (music: Music) => {
		setSelectedMusic(music);
		setIsDialogOpen(true);
	};

	const toggleFavorite = async (music_id : number) => {
		const isFavorite = favoriteMusics.has(music_id );
		const isfav = favorite_musics.some(fav => fav.id === music_id )

		// Partir de l'état actuel
		const updatedFavorites = new Set(favoriteMusics);
		const updatedFav = new Set(favoriteMusics1);
	
		if (isFavorite || isfav) {
			updatedFavorites.delete(music_id );
        	updatedFav.delete(music_id );

			await fetch("http://localhost:5000/remove_favorite_musics", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ music_id  }),
			});
		} else {
			updatedFavorites.add(music_id );
        	updatedFav.add(music_id);
			await fetch("http://localhost:5000/add_favorite_musics", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ music_id  }),
			});
		}
		setFavoriteMusics(updatedFavorites);
		setFavoriteMusics1(updatedFav);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
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
						<TableHead>Artist</TableHead>
						<TableHead>Play Count</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{music.map((song, idx) => (
						<TableRow key={idx} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={song.album_image} alt={song.track_name} className='size-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{song.track_name}</TableCell>
							<TableCell>{song.artist_name}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<HeadphonesIcon className='h-4 w-4' />
									{song.playcount}
								</span>
							</TableCell>

							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant={"ghost"}
										size={"sm"}
										className='text-sky-500 hover:text-sky-400 hover:bg-blue-400/10'
										onClick={() => handleOpenDialog(song)}
									>
										<Eye className='size-4' />
									</Button>
									<Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={() => toggleFavorite(song.id)}
                                    >
                                        <Heart className={ favoriteMusics1.has(song.id)? "text-emerald-400 fill-emerald-400 size-4" : "text-zinc-400 size-4"}  />
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
					disabled={page_songs === 1}
					onClick={prevPageSongs}
					variant='outline'
				>
					Previous
				</Button>
				<span className='text-white'>
					Page {page_songs} of {Math.ceil(total_songs / per_page_songs)}
				</span>
				<Button
					disabled={page_songs * per_page_songs >= total_songs}
					onClick={nextPageSongs}
					variant='outline'
				>
					Next
				</Button>
			</div>
			{/* Boîte de dialogue avec les détails du film */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='bg-zinc-900 text-white'>
					{selectedMusic && (
						<>
							<DialogHeader>
								<DialogTitle>{selectedMusic.track_name}</DialogTitle>
								<DialogDescription className='text-zinc-400'>{selectedMusic.artist_name}</DialogDescription>
							</DialogHeader>
							<div className='flex gap-4'>
								<img
									src={selectedMusic.album_image}
									alt={selectedMusic.track_name}
									className='size-60 rounded object-cover'
								/>
								<div className='flex flex-col gap-2'>
									<p className='text-zinc-400'><strong className="text-white">Genres:</strong> {selectedMusic.genres.join(", ")}</p>
									<p className='text-zinc-400'><strong className="text-white">Listeners :</strong> {selectedMusic.listeners} 🎧</p>
									<p className='text-zinc-400'><strong className="text-white">Play Count :</strong> {selectedMusic.playcount} 👤</p>
									<p className='text-zinc-400'><strong className="text-white">Audio Url:</strong> {selectedMusic.audio_url}</p>
								</div>
							</div>

						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SongsTable;
