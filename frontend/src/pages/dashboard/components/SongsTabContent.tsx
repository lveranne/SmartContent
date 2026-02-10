import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListMusic } from "lucide-react";
import SongsTable from "../components/SongsTable";
const SongsTabContent = () => {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<ListMusic className='size-5 text-sky-500' />
							Songs Library
						</CardTitle>
						<CardDescription>Manage your music tracks</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;
