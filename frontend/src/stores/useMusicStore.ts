import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats, Music, Movie, Game, Book } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  music: Music[];
  favorite_musics: Music[];
  movies: Movie[];
  favorite_movies: Movie[];
  games: Game[];
  favorite_games: Game[];
  books: Book[];
  favorite_books: Book[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  total_songs: number;
  total_movies: number;
  total_games: number;
  total_books: number;
  page_songs: number;
  page_movies: number;
  page_games: number;
  page_books: number;
  per_page_songs: number;
  per_page_movies: number;
  per_page_games: number;
  per_page_books: number;
  
  fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
  fetchSongs: (page_songs?: number) => Promise<void>;
  fetchMovies: (page_movies?: number) => Promise<void>;
  fetchBooks: (page_books?: number) => Promise<void>;
  fetchGames: (page_games?: number) => Promise<void>;
  fetchFavoriteMovies: () => Promise<void>;
  fetchFavoriteMusics: () => Promise<void>;
  fetchFavoriteBooks: () => Promise<void>;
  fetchFavoriteGames: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  nextPageSongs: () => void;
  prevPageSongs: () => void;
  nextPageMovies: () => void;
  prevPageMovies: () => void;
  nextPageGames: () => void;
  prevPageGames: () => void;
  nextPageBooks: () => void;
  prevPageBooks: () => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  music: [],
  favorite_musics: [],
  movies: [],
  favorite_movies: [],
  games: [],
  favorite_games: [],
  books: [],
  favorite_books: [],
  page_songs: 1,
  page_movies: 1,
  page_games: 1,
  page_books: 1,
  total_songs: 0,
  total_movies: 0,
  total_books: 0,
  total_games: 0,
  per_page_songs: 7,
  per_page_movies: 7,
  per_page_games: 7,
  per_page_books: 7,
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMovie: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGame: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async (page_songs = 1) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/music?page_songs=${page_songs}&per_page_songs=7`
      );
      set({
        music: response.data.songs,
        total_songs: response.data.total_songs,
        page_songs: response.data.page_songs,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMovies: async (page_movies = 1) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/movie?page_movies=${page_movies}&per_page_movies=7`
      );
      set({
        movies: response.data.movies,
        total_movies: response.data.total_movies,
        page_movies: response.data.page_movies,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGames: async (page_games = 1) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/game?page_games=${page_games}&per_page_games=7`
      );
      set({
        games: response.data.games,
        total_games: response.data.total_games,
        page_games: response.data.page_games,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchBooks: async (page_books = 1) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/book?page_books=${page_books}&per_page_books=7`
      );
      set({
        books: response.data.books,
        total_books: response.data.total_books,
        page_books: response.data.page_books,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFavoriteMovies: async () => {
    try {
      const response = await axiosInstance.get(
        'http://localhost:5000/favorites_movies'
      );
      set({ 
        favorite_movies: response.data,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFavoriteMusics: async () => {
    try {
      const response = await axiosInstance.get(
        'http://localhost:5000/favorites_musics'
      );
      set({ 
        favorite_musics: response.data,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFavoriteGames: async () => {
    try {
      const response = await axiosInstance.get(
        'http://localhost:5000/favorites_games'
      );
      set({ 
        favorite_games: response.data,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFavoriteBooks: async () => {
    try {
      const response = await axiosInstance.get(
        'http://localhost:5000/favorites_books'
      );
      set({ 
        favorite_books: response.data,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  nextPageSongs: () => {
    const { page_songs, total_songs, per_page_songs, fetchSongs } = get();
    if (page_songs * per_page_songs < total_songs) {
      fetchSongs(page_songs + 1);
    }
  },

  prevPageSongs: () => {
    const { page_songs, fetchSongs } = get();
    if (page_songs > 1) {
      fetchSongs(page_songs - 1);
    }
  },

  nextPageMovies: () => {
    const { page_movies, total_movies, per_page_movies, fetchMovies } = get();
    if (page_movies * per_page_movies < total_movies) {
      fetchMovies(page_movies + 1);
    }
  },

  prevPageMovies: () => {
    const { page_movies, fetchMovies } = get();
    if (page_movies > 1) {
      fetchMovies(page_movies - 1);
    }
  },

  nextPageGames: () => {
    const { page_games, total_games, per_page_games, fetchGames } = get();
    if (page_games * per_page_games < total_games) {
      fetchGames(page_games + 1);
    }
  },

  prevPageGames: () => {
    const { page_games, fetchGames } = get();
    if (page_games > 1) {
      fetchGames(page_games - 1);
    }
  },

  nextPageBooks: () => {
    const { page_books, total_books, per_page_books, fetchBooks } = get();
    if (page_books * per_page_books < total_books) {
      fetchBooks(page_books + 1);
    }
  },

  prevPageBooks: () => {
    const { page_books, fetchBooks } = get();
    if (page_books > 1) {
      fetchBooks(page_books - 1);
    }
  },


	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
	

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

  fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const defaultSongs = await axiosInstance.get("/songs/trending");
			set({ featuredSongs: defaultSongs });
		} catch (error: any) {
			set({ error: error.message });
			toast.error("Failed to load featured songs.");
		} finally {
			set({ isLoading: false });
		}
	},
	
}));
