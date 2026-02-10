import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";

const FeaturedSection = () => {
	const { isLoading } = useMusicStore();

	const featuredSongs = [
			{
			  "_id": "1",
			  "title": "Impact & Mode AV",
			  "artist": "Gazo",
			  "imageUrl": "/cover-music/1.jpg",
			  "audioUrl": "/songs/1.mp3",
			  "duration": 46
			},
			{
				"_id": "2",
			  "title": "Stay With Me",
			  "artist": "Ronisia",
			  "imageUrl": "/cover-music/2.jpg",
			  "audioUrl": "/songs/2.mp3",
			  "duration": 41
			},
			{
			  "_id": "3",
			  "title": "Lost in Tokyo",
			  "artist": "Maitre Gims",
			  "imageUrl": "/cover-music/3.jpg",
			  "audioUrl": "/songs/3.mp3",
			  "duration": 24
			},
			{
			  "_id": "4",
			  "title": "W.L.G & 44",
			  "artist": "Niska",
			  "imageUrl": "/cover-music/4.jpg",
			  "audioUrl": "/songs/4.mp3",
			  "duration": 24
			},
			{
			  "_id": "5",
			  "title": "Every Day",
			  "artist": "Ninho",
			  "imageUrl": "/cover-music/5.jpg",
			  "audioUrl": "/songs/5.mp3",
			  "duration": 36
			},
			{
			  "_id": "6",
			  "title": "Manon Brench",
			  "artist": "Tiakola",
			  "imageUrl": "/cover-music/6.jpg",
			  "audioUrl": "/songs/6.mp3",
			  "duration": 40
			}
		   
	];

	if (isLoading) return <FeaturedGridSkeleton />;

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
			{featuredSongs.map((song) => (
				<div
					key={song._id}
					className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
         hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
				>
					<img
						src={song.imageUrl}
						alt={song.title}
						className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
					/>
					<div className='flex-1 p-4'>
						<p className='font-medium truncate'>{song.title}</p>
						<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
					</div>
					<PlayButton />
				</div>
			))}
		</div>
	);
};
export default FeaturedSection;
