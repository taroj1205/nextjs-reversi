import { useState, useEffect, useCallback } from "react";
import { Button } from "@yamada-ui/react";

interface AutoPlayButtonProps {
	currentPlayerRef: React.MutableRefObject<number>;
	board: number[][];
	setBoard: React.Dispatch<React.SetStateAction<number[][]>>;
	gameResult: React.MutableRefObject<number | null>;
	getValidMoves: (board: number[][], player: number) => number[][];
	handleClick: (row: number, col: number) => void;
	autoPlayTimeout: number;
}

const AutoPlayButton: React.FC<AutoPlayButtonProps> = ({
	currentPlayerRef,
	board,
	setBoard,
	gameResult,
	getValidMoves,
	handleClick,
	autoPlayTimeout,
}) => {
	const [isAutoPlaying, setIsAutoPlaying] = useState(false);

	const autoPlay = useCallback(() => {
		if (!gameResult.current) {
			const validMoves = getValidMoves(board, currentPlayerRef.current);
			if (validMoves.length > 0) {
				const randomIndex = Math.floor(Math.random() * validMoves.length); // Generate a random index
				const [row, col] = validMoves[randomIndex]; // Take a random valid move
				handleClick(row, col);
			}
		} else {
			setIsAutoPlaying(false); // Stop auto-playing when the game is over
		}
	}, [board, currentPlayerRef, gameResult, getValidMoves, handleClick]);

	useEffect(() => {
		if (isAutoPlaying) {
			const timer = setInterval(autoPlay, autoPlayTimeout); // Play a move every second
			return () => clearInterval(timer); // Clean up on unmount or when isAutoPlaying changes
		}
	}, [isAutoPlaying, autoPlay, autoPlayTimeout]);

	return (
		<Button
			className="mx-auto my-2"
			onClick={() => setIsAutoPlaying(!isAutoPlaying)}>
			{isAutoPlaying ? "Stop Auto-Play" : "Start Auto-Play"}
		</Button>
	);
};

export default AutoPlayButton;