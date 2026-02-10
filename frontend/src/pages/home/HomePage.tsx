import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

const HomePage = () => {
	
	const {
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);
	
	const movies = [
			{
			"_id": "1",
			"title": "Sonic Hedge dog",
			"artist": "Action, Adventure, Comedy, Family, Science Fiction",
			"imageUrl": "/cover-movies/1.jpg",
			"audioUrl": "/songs/1.mp3",
			"duration": 46
			},
			{
			"_id": "2",
			"title": "Squid Game",
			"artist": "Thriller, Drama, Psychological Suspense, Survival",
			"imageUrl": "/cover-movies/2.jpg",
			"audioUrl": "/songs/2.mp3",
			"duration": 41
			},
			{
			"_id": "3",
			"title": "Alice in Botherland",
			"artist": "Science Fiction, Thriller, Action, Drama, Survival  ",
			"imageUrl": "/cover-movies/3.jpg",
			"audioUrl": "/songs/3.mp3",
			"duration": 24
			},
			{
			"_id": "4",
			"title": "Matrix",
			"artist": "Science Fiction, Action, Cyberpunk, Thriller, Adventure",
			"imageUrl": "/cover-movies/4.jpg",
			"audioUrl": "/songs/4.mp3",
			"duration": 24
			},	
		];

	const games = [
			{
			"_id": "1",
			"title": "Call of Duty",
			"artist": "PS, Xbox, Mobile, PC",
			"imageUrl": "/cover-games/1.jpg",
			"audioUrl": "/songs/1.mp3",
			"duration": 46
			},
			{
			"_id": "2",
			"title": "Assassin Creed",
			"artist": "PS, Xbox, Mobile, PC, Nintendo",
			"imageUrl": "/cover-games/2.jpg",
			"audioUrl": "/songs/2.mp3",
			"duration": 41
			},
			{
			"_id": "3",
			"title": "FIFA 2023",
			"artist": "PS, Xbox, PC, Nintendo",
			"imageUrl": "/cover-games/3.jpg",
			"audioUrl": "/songs/3.mp3",
			"duration": 24
			},
			{
			"_id": "4",
			"title": "GTA Vice City",
			"artist": "PS, Mobile, PC",
			"imageUrl": "/cover-games/4.jpg",
			"audioUrl": "/songs/4.mp3",
			"duration": 24
			},	
		];

	const books = [
			{
			"_id": "1",
			"title": "Harry Potter",
			"artist": "J.K. Rowling",
			"imageUrl": "/cover-books/1.jpg",
			"audioUrl": "/songs/1.mp3",
			"duration": 46
			},
			{
			"_id": "2",
			"title": "The Good Sister",
			"artist": "Sally Hepworth",
			"imageUrl": "/cover-books/2.jpg",
			"audioUrl": "/songs/2.mp3",
			"duration": 41
			},
			{
			"_id": "3",
			"title": "Alone",
			"artist": "Riley Sager",
			"imageUrl": "/cover-books/3.jpg",
			"audioUrl": "/songs/3.mp3",
			"duration": 24
			},
			{
			"_id": "4",
			"title": "Darkness Waits",
			"artist": "Jeffrey J. Mayer",
			"imageUrl": "/cover-books/4.jpg",
			"audioUrl": "/songs/4.mp3",
			"duration": 24
			},	
		];

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Lively Music</h1>
					<FeaturedSection />

					<div className='space-y-8'>
						<SectionGrid title='Trending Movies' songs={movies} isLoading={isLoading} />
						<SectionGrid title='Amazing Games' songs={games} isLoading={isLoading} />
						<SectionGrid title='Entertainment Books' songs={books} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
