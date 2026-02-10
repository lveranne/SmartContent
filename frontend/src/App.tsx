import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";

import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
	return (
		<>
			<Routes>
				<Route element={<MainLayout />}>
						<Route path='/' element={<HomePage />} />
						<Route path='/dashboard' element={<DashboardPage />} />
						<Route path='/chat' element={<ChatPage />} />
						<Route path='/albums/:albumId' element={<AlbumPage />} />
				</Route>
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
