import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Library, Music, Clapperboard, Gamepad2  } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import MoviesTabContent from "./components/MoviesTabContent";
import GamesTabContent from "./components/GamesTabContent";

const DashboardPage = () => {


	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='movies' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='movies' className='data-[state=active]:bg-zinc-700'>
						<Clapperboard  className='mr-2 size-4' />
						Movies
					</TabsTrigger>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					
					<TabsTrigger value='games' className='data-[state=active]:bg-zinc-700'>
						<Gamepad2 className='mr-2 size-4' />
						Games
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Library className='mr-2 size-4' />
						Books
					</TabsTrigger>
				</TabsList>


				<TabsContent value='movies'>
					<MoviesTabContent />
				</TabsContent>
				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='games'>
					<GamesTabContent/>
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
				
			</Tabs>
		</div>
	);
};
export default DashboardPage;
