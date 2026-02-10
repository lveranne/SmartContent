import { useMusicStore } from "@/stores/useMusicStore";
import { Library, Music, Gamepad2, Clapperboard  } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
	const { total_songs, total_movies, total_games, total_books } = useMusicStore();

	const statsData = [
		{
			icon: Clapperboard ,
			label: "Total Movies",
			value: total_movies.toString(),
			bgColor: "bg-orange-500/10",
			iconColor: "text-orange-500",
		},
		{
			icon: Music,
			label: "Total Songs",
			value: total_songs.toString(),
			bgColor: "bg-sky-500/10",
			iconColor: "text-sky-500",
		},
		{
			icon: Gamepad2,
			label: "Total Games",
			value: total_games.toString(),
			bgColor: "bg-red-500/10",
			iconColor: "text-red-500",
		},
		{
			icon: Library,
			label: "Total Books",
			value: total_books.toString(),
			bgColor: "bg-violet-500/10",
			iconColor: "text-violet-500",
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 '>
			{statsData.map((stat) => (
				<StatsCard
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					value={stat.value}
					bgColor={stat.bgColor}
					iconColor={stat.iconColor}
				/>
			))}
		</div>
	);
};
export default DashboardStats;
