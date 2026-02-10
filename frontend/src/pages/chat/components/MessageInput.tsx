import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { Send } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
	userId: string ;
  }
  
  const MessageInput = ({ userId }: MessageInputProps) => {
	const [newMessage, setNewMessage] = useState("");
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !newMessage) return;
		sendMessage( userId , newMessage.trim(), selectedUser.clerkId);
		setNewMessage("");
	};

	return (
		<div className='p-4 mt-auto border-t border-zinc-800'>
			<div className='flex gap-2'>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-zinc-800 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
