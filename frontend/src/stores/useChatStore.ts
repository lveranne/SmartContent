import { axiosInstance } from "@/lib/axios";
import { Message, User, Game, Movie, Music, Book } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

// Définir les utilisateurs pour chaque catégorie de bot
const bots: User[] = [
  {
    _id: "gamesbot",
    clerkId: "123",
    fullName: "Games Bot",
    imageUrl: "/bots/1.jpg",
  },
  {
    _id: "booksbot",
    clerkId: "456",
    fullName: "Books Bot",
    imageUrl: "/bots/2.jpg",
  },
  {
    _id: "musicbot",
    clerkId: "789",
    fullName: "Music Bot",
    imageUrl: "/bots/3.jpg",
  },
  {
    _id: "moviesbot",
    clerkId: "000",
    fullName: "Movies Bot",
    imageUrl: "/bots/4.jpg",
  },
];

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  messages: Message[];
  recommendation_game: Game[];
  recommendation_music: Music[];
  recommendation_book: Book[];
  recommendation_movie: Movie[];
  selectedUser: User | null;
  step: number; // Étape actuelle
  genres: string[]; // Genres choisis
  platforms: string[]; // Plateformes choisies

  setStep: (step: number) => void;
  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  handleBotMessage: (category: string) => void; // Nouvelle fonction pour gérer les messages des bots
}

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: bots, // Les bots sont les utilisateurs initiaux
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(["gamesbot", "booksbot", "musicbot", "moviesbot"]), // Les bots sont déjà connectés
  userActivities: new Map(),
  messages: [],
  recommendation_game: [],
  recommendation_music: [],
  recommendation_book: [],
  recommendation_movie: [],
  selectedUser: null,
  step: 1,
  genres: [], // Initialisation comme tableau vide
  platforms: [], // Initialisation comme tableau vide

  setStep: (step) => set({ step }),

  setSelectedUser: (user) => {
    set(() => ({
      selectedUser: user,
      messages: [], // Réinitialiser les messages lors du changement de bot
    }));
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ users: bots }); // Utiliser les bots comme utilisateurs fixes
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();

      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({
          onlineUsers: new Set([
            ...users,
            "gamesbot",
            "booksbot",
            "musicbot",
            "moviesbot",
          ]),
        }); // Assurez-vous que les bots sont considérés comme en ligne
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: async (senderId, content, receiverId) => {
    const { step, genres } = get();

    const newMessage = {
      _id: crypto.randomUUID(),
      senderId,
      receiverId, // Ajouter receiverId
      content,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Obtenir l'ID de l'utilisateur sélectionné
    const selectedUserId = get().selectedUser?._id || "";

    if (selectedUserId === "gamesbot") {
      // Logique par étapes
      if (step === 1) {
        // Étape 1 : Choix du genre
        set({ recommendation_game: [] });
        const validGenres = [
          "action",
          "adventure",
          "arcade",
          "board games",
          "card",
          "casual",
          "educational",
          "family",
          "fighting",
          "indie",
          "massively multiplayer",
          "platformer",
          "puzzle",
          "rpg",
          "racing",
          "shooter",
          "simulation",
          "sport",
          "strategy",
        ];
        const chosenGenres = content
          .toLowerCase()
          .split(",")
          .map((g) => g.trim());

        // Vérifier les genres choisis
        const validChosenGenres = chosenGenres.filter((genre) =>
          validGenres.includes(genre)
        );
        if (validChosenGenres.length > 0) {
          set({ genres: validChosenGenres, step: 2 });
          set({ recommendation_game: [] });
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content:
              "🤩 🤩 Amazing! Now, what platform do you prefer? (3DO, Android, Apple , Atari, Classic , Commodore, Dreamcast, Game Boy, Genesis, Jaguar, Linux, NES, Neo Geo, Nintendo, PC, PS, PSP, PlayStation, SEGA 32X, Web, Wii, Xbox,iOS, MacOS...)",
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
        } else {
          const getGameRecommendationsTitle = async (title) => {
            try {
              const response = await fetch(
                "http://localhost:5000/recommend_title",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ title }),
                }
              );

              if (!response.ok) {
                throw new Error(`Erreur du serveur : ${response.statusText}`);
              }

              const recommendations = await response.json();
              return recommendations;
            } catch (error) {
              return [];
            }
          };
          const recommendedGamesTitle = await getGameRecommendationsTitle(
            content.toLowerCase()
          );

          if (
            recommendedGamesTitle && // Vérifie que ce n'est pas null/undefined
            typeof recommendedGamesTitle === "object" &&
            Object.keys(recommendedGamesTitle).length === 0
          ) {
            const botMessage: Message = {
              _id: crypto.randomUUID(),
              senderId: receiverId,
              receiverId: senderId,
              content:
                "❓ I don't know what you mean To help you, please choose between Adventure, Action, ...",
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, botMessage],
            }));
          } else {
            const botMessage: Message = {
              _id: crypto.randomUUID(),
              senderId: receiverId,
              receiverId: senderId,
              content: `I can recommend you those games based on what you write, give it a try`,
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, botMessage],
            }));
            recommendedGamesTitle.forEach((game, index) => {
              const gameMessage: Message = {
                _id: crypto.randomUUID(),
                senderId: receiverId,
                receiverId: senderId,
                content: `Recommendation ${index + 1}: ${game.title}`,
                createdAt: new Date().toISOString(),
              };
              set((state) => ({
                messages: [...state.messages, gameMessage],
              }));
              set((state) => ({
                recommendation_game: [...state.recommendation_game, game], // Utiliser `recommendation` ici
              }));
            });
          }
        }
      } else if (step === 2) {
        // Étape 3 : Choix de la plateforme
        const validPlatforms = [
          "xbox",
          "playstation",
          "pc",
          "3do",
          "android",
          "atari",
          "apple",
          "classic",
          "commodore",
          "dreamcast",
          "ps",
          "game",
          "boy",
          "genesis",
          "Jaguar",
          "linux",
          "nes",
          "neo",
          "geo",
          "nintendo",
          "sega",
          "psp",
          "web",
          "ios",
          "macOS",
          "wii",
          "snes",
        ];
        const chosenPlatforms = content
          .toLowerCase()
          .split(",")
          .map((p) => p.trim());

        // Vérifier les plateformes choisies
        const validChosenPlatforms = chosenPlatforms.filter((platform) =>
          validPlatforms.includes(platform)
        );
        if (validChosenPlatforms.length > 0) {
          set({ platforms: validChosenPlatforms, step: 1 });
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content: `🎉 Awesome! For the Genres : ${genres.join(
              ", "
            )}, Platforms : ${validChosenPlatforms.join(
              ", "
            )}, I can recommend you those games, give it a try`,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
          // Envoyer trois messages distincts pour les jeux recommandés
          const getGameRecommendations = async (genre, platform) => {
            try {
              console.log("Envoi des données :", { genre, platform }); // Vérifier les données avant l'envoi

              const response = await fetch("http://localhost:5000/recommend", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ genre, platform }),
              });

              if (!response.ok) {
                throw new Error(`Erreur du serveur : ${response.statusText}`);
              }

              const recommendations = await response.json();
              console.log("Recommandations reçues :", recommendations); // Vérifier la réponse
              return recommendations;
            } catch (error) {
              console.error("Erreur lors de l'appel à l'API :", error);
              return [];
            }
          };

          const recommendedGames = await getGameRecommendations(
            genres.join(", "),
            validChosenPlatforms.join(", ")
          );
          recommendedGames.forEach((game, index) => {
            const gameMessage: Message = {
              _id: crypto.randomUUID(),
              senderId: receiverId,
              receiverId: senderId,
              content: `Recommendation ${index + 1}: ${game.title}`,
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, gameMessage],
            }));
            set((state) => ({
              recommendation_game: [...state.recommendation_game, game], // Utiliser `recommendation` ici
            }));
          });
        } else {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content:
              "❓ Invalid platform(s). Please choose between Xbox, PlayStation, or PC.",
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
        }
      }
    } else if (selectedUserId === "booksbot") {
      set({ recommendation_book: [] });
      // Étape 1 : Choix du genre
        const getRecommendationsBook = async (query_book) => {
          try {
            const response = await fetch(
              "http://localhost:5000/recommend_book",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ query_book }),
              }
            );

            if (!response.ok) {
              throw new Error(`Erreur du serveur : ${response.statusText}`);
            }

            const recommendations = await response.json();
            console.log("Recommandations reçues :", recommendations); // Vérifier la réponse
            return recommendations;
          } catch (error) {
            console.error("Erreur lors de l'appel à l'API :", error);
            return [];
          }
        };
        const recommendedBooks = await getRecommendationsBook(
          content.toLowerCase()
        );

        if (
          recommendedBooks && // Vérifie que ce n'est pas null/undefined
          typeof recommendedBooks === "object" &&
          Object.keys(recommendedBooks).length === 0
        ) {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content:
              "❓ I don't know what you mean To help you, please be specific ...",
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
        } else {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content: `I can recommend you those musics, give it a try`,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
          recommendedBooks.forEach((book, index) => {
            const gameMessage: Message = {
              _id: crypto.randomUUID(),
              senderId: receiverId,
              receiverId: senderId,
              content: `Recommendation ${index + 1}: ${book.title}`,
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, gameMessage],
            }));
            set((state) => ({
              recommendation_book: [...state.recommendation_book, book], // Utiliser `recommendation` ici
            }));
          });
        }
      
    } else if (selectedUserId === "musicbot") {
      set({ recommendation_music: [] });
      // Étape 1 : Choix du genre
        const getRecommendationsMusic = async (query_music) => {
          try {
            const response = await fetch(
              "http://localhost:5000/recommend_music",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ query_music }),
              }
            );

            if (!response.ok) {
              throw new Error(`Erreur du serveur : ${response.statusText}`);
            }

            const recommendations = await response.json();
            console.log("Recommandations reçues :", recommendations); // Vérifier la réponse
            return recommendations;
          } catch (error) {
            console.error("Erreur lors de l'appel à l'API :", error);
            return [];
          }
        };
        const recommendedMusics = await getRecommendationsMusic(
          content.toLowerCase()
        );

        if (
          recommendedMusics && // Vérifie que ce n'est pas null/undefined
          typeof recommendedMusics === "object" &&
          Object.keys(recommendedMusics).length === 0
        ) {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content:
              "❓ I don't know what you mean To help you, please be specific ...",
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
        } else {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content: `I can recommend you those musics, give it a try`,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
          recommendedMusics.forEach((music, index) => {
            const gameMessage: Message = {
              _id: crypto.randomUUID(),
              senderId: receiverId,
              receiverId: senderId,
              content: `Recommendation ${index + 1}: ${music.track_name}`,
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, gameMessage],
            }));
            set((state) => ({
              recommendation_music: [...state.recommendation_music, music], // Utiliser `recommendation` ici
            }));
          });
        }
           
          
    } else if (selectedUserId === "moviesbot") {
      set({ recommendation_movie: [] });
      // Étape 1 : Choix du genre
        const getRecommendationsMovie = async (query) => {
          try {
            const response = await fetch(
              "http://localhost:5000/recommend_movie",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
              }
            );

            if (!response.ok) {
              throw new Error(`Erreur du serveur : ${response.statusText}`);
            }

            const recommendations = await response.json();
            console.log("Recommandations reçues :", recommendations); // Vérifier la réponse
            return recommendations;
          } catch (error) {
            console.error("Erreur lors de l'appel à l'API :", error);
            return [];
          }
        };

        const recommendedMovies = await getRecommendationsMovie(
          content.toLowerCase()
        );

        if (
          recommendedMovies && // Vérifie que ce n'est pas null/undefined
          typeof recommendedMovies === "object" &&
          Object.keys(recommendedMovies).length === 0
        ) {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content:
              "❓ I don't know what you mean To help you, please choose between Adventure, Action, ...",
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
        } else {
          const botMessage: Message = {
            _id: crypto.randomUUID(),
            senderId: receiverId,
            receiverId: senderId,
            content: `I can recommend you those movies based on your description, give it a try`,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, botMessage],
          }));
          recommendedMovies.forEach((movie, index) => {
            const gameMessage: Message = {
              _id: crypto.randomUUID(),
              senderId: receiverId,
              receiverId: senderId,
              content: `Recommendation ${index + 1}: ${movie.title}`,
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, gameMessage],
            }));
            set((state) => ({
              recommendation_movie: [...state.recommendation_movie, movie], // Utiliser `recommendation` ici
            }));
          });
        }
    }
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  handleBotMessage: (botId: string) => {
    let botMessageContent: string;
    const receiverId = "user";

    switch (botId) {
      case "gamesbot":
        botMessageContent =
          "Hello, I am your assistant for video games! What kind of games are you looking for Action 🚁, Adventure 🧭, Puzzle 🧩, Racing 🏁, Board games♟️, Fighting ⚔️, Card 🃏, Educational 🎓, Arcade, Casual, Family, Indie, Massively Multiplayer, Platformer, RPG, Shooter, Simulation, Sport, Strategy";
        break;
      case "booksbot":
        botMessageContent =
          "Hello, I am your assistant for Books ! What kind of book do you like? ? (Action, Science Fiction...) or if you like you can gdescribe ";
        break;
      case "musicbot":
        botMessageContent =
          "Hello, I am your assistant for Music! What types of music do you listen (Soul, Pop, Afro...) or if you like you can give me the name of an artist you like";
        break;
      case "moviesbot":
        botMessageContent =
          "Hello, I am your assistant for Movies! What kind of movies do you like? ? (Action, Adventure, Comedy, Horror, Science Fiction...) or if you like you can describe your movie";
        break;
      default:
        botMessageContent =
          "Je ne suis pas sûr de pouvoir vous aider avec cette catégorie.";
        break;
    }

    const botMessage: Message = {
      _id: crypto.randomUUID(),
      senderId: botId,
      receiverId, // Ajouter receiverId
      content: botMessageContent,
      createdAt: new Date().toISOString(),
    };

    set({ messages: [...get().messages, botMessage] });
  },
}));
