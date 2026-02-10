export interface Song {
	_id: string;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	popularity: number;
}

export interface Music {
	_id: string;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
}

export interface Bot {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export interface choice_game {
	_id: string;
	genre: string;
	platform: string;
}

export interface Game {
	id: number;  // Ajout de l'identifiant unique du film
	title: string;
	genres: string;
    platforms: string;
    rating: number;
    background_image: string;     
    release_date: string;
}

export interface Movie {
    id: number;  // Ajout de l'identifiant unique du film
    title: string;
    original_language: string;
    translated_genres: string;
    vote_average: number;
    overview: string;
    poster_path: string;     
    release_date: string;
}

export interface Music {
	id: number;  // Ajout de l'identifiant unique du film
	track_name : string;
	artist_name: string;
	listeners : number;
	playcount : number;
    genres: string;
    album_image: string;     
    audio_url : string;
}

export interface Book {
	id: string;  // Ajout de l'identifiant unique du livre
	title : string;
	authors: string;
	published : string;
	language : string;
    genre: string;
    cover: string;   
	link: string; 
}

