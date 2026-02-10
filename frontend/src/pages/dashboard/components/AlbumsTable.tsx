import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Eye, Calendar, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Book } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AlbumsTable = () => {
	const {
		books,
		isLoading,
		favorite_books,
		error,
		fetchBooks,
		page_books,
		total_books,
		per_page_books,
		nextPageBooks,
		prevPageBooks,
	} = useMusicStore();

	const [selectedBook, setSelectedBook] = useState<Book  | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [favoriteBooks, setFavoriteBooks] = useState(new Set());
	const [favoriteBooks1, setFavoriteBooks1] = useState(new Set());

	useEffect(() => {
		fetchBooks(page_books);
		setFavoriteBooks1(new Set(favorite_books.map(fav => fav.id)));
	}, [page_books, fetchBooks, setFavoriteBooks1, favorite_books]);

	// Fonction pour ouvrir la boîte de dialogue avec les infos du film sélectionné
	const handleOpenDialog = (book: Book) => {
			setSelectedBook(book);
			setIsDialogOpen(true);
	};

	const toggleFavorite = async (book_id : number) => {
		const isFavorite = favoriteBooks.has(book_id);
		const isfav = favorite_books.some(fav => fav.id === book_id)

		// Partir de l'état actuel
		const updatedFavorites = new Set(favoriteBooks);
		const updatedFav = new Set(favoriteBooks1);
	
		if (isFavorite || isfav) {
			updatedFavorites.delete(book_id);
        	updatedFav.delete(book_id);

			await fetch("http://localhost:5000/remove_favorite_books", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ book_id}),
			});
		} else {
			updatedFavorites.add(book_id);
        	updatedFav.add(book_id);
			await fetch("http://localhost:5000/add_favorite_books", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ book_id}),
			});
		}
		setFavoriteBooks(updatedFavorites);
		setFavoriteBooks1(updatedFav);
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
					{books.map((book, idx) => (
						<TableRow key={idx} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={book.cover} alt={book.title} className='size-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{book.title} </TableCell>
							<TableCell>{book.genre?.length ? book.genre.join(", ") : "/"}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Calendar className='h-4 w-4' />
									{book.published}
								</span>
							</TableCell>

							
							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant={"ghost"}
										size={"sm"}
										className='text-violet-500 hover:text-violet-400 hover:bg-blue-400/10'
										onClick={() => handleOpenDialog(book)}
									>
										<Eye className='size-4' />
									</Button>
									<Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={() => toggleFavorite(book.id)}
                                    >
                                        <Heart className={ favoriteBooks1.has(book.id)? "text-emerald-400 fill-emerald-400 size-4" : "text-zinc-400 size-4"}  />
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
					disabled={page_books === 1}
					onClick={prevPageBooks}
					variant='outline'
				>
					Previous
				</Button>
				<span className='text-white'>
					Page {page_books} of {Math.ceil(total_books / per_page_books)}
				</span>
				<Button
					disabled={page_books * per_page_books >= total_books}
					onClick={nextPageBooks}
					variant='outline'
				>
					Next
				</Button>
			</div>

			{/* Boîte de dialogue avec les détails du film */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='bg-zinc-900 text-white'>
					{selectedBook && (
						<>
							<DialogHeader>
								<DialogTitle>{selectedBook.title}</DialogTitle>
								<DialogDescription className='text-zinc-400'>{selectedBook.authors?.length ? selectedBook.authors : "Unknown"}</DialogDescription>
							</DialogHeader>
							<div className='flex gap-4'>
								<img
									src={selectedBook.cover}
									alt={selectedBook.title}
									className='size-60 rounded object-cover'
								/>
								<div className='flex flex-col gap-2'>
									<p className='text-zinc-400'><strong className="text-white">Original Language :</strong> {selectedBook.language}</p>
									<p className='text-zinc-400'><strong className="text-white">Genres:</strong> {selectedBook.genre?.length ? selectedBook.genre : "Unknown"}</p>
									<p className='text-zinc-400'><strong className="text-white">Release Date :</strong> {selectedBook.published}</p>
									<p className='text-zinc-400'><strong className="text-white">Link :</strong> {selectedBook.link}</p>
								</div>
							</div>

						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AlbumsTable;
