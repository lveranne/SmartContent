import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";
import MoviesTable from "../components/MoviesTable";

const MoviesTabContent = () => {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Video className='size-5 text-orange-500' />
							Movies Library
						</CardTitle>
						<CardDescription>Manage your movies </CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<MoviesTable />
			</CardContent>
		</Card>
	);
};
export default MoviesTabContent;
