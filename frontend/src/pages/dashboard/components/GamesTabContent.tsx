import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Joystick  } from "lucide-react";
import GamesTable from "../components/GamesTable";

const GamesTabContent = () => {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Joystick  className='size-5 text-red-500' />
							Games Library
						</CardTitle>
						<CardDescription>Manage your games </CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<GamesTable />
			</CardContent>
		</Card>
	);
};
export default GamesTabContent;
