import { Button } from "@/components/ui/button";
import { Heart, HeartOff  } from "lucide-react";
import { useState } from "react";

const PlayButton = () => {
	// État pour gérer si le morceau est "liké"
	const [liked, setLiked] = useState(false);

	const handleLike = () => {
	  setLiked(!liked); // Bascule l'état "liké" lorsqu'on clique
	};

	return (
		<Button
        size={"icon"}
        onClick={handleLike}
        className={`absolute bottom-3 right-2 bg-green-400 hover:bg-green-400 hover:scale-105 transition-all 
			opacity-0 translate-y-2 group-hover:translate-y-0 ${
            liked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
      >
			{liked ? (
			<Heart className="size-5" />
			) : (
			<HeartOff className="size-5" />
			)}
		</Button>
	);
};
export default PlayButton;



