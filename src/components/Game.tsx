"use client";
import { Board } from "@/components/Board";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Settings } from "./Settings";
import { HStack, IconButton, useLoading } from "@yamada-ui/react";
import { FaRedo } from "react-icons/fa";

export interface BoardProps {
	currentPlayerRef: {current: number};
	showPreview: [boolean, boolean];
	setShowPreview: Dispatch<SetStateAction<[boolean, boolean]>>;
	playerColors: [string, string, string];
	setPlayerColors: Dispatch<SetStateAction<[string, string, string]>>;
	globalPreview: boolean;
	setGlobalPreview: Dispatch<SetStateAction<boolean>>;
	board: number[][];
  setBoard: Dispatch<SetStateAction<number[][]>>;
  gameResult: {current: number | null};
}

export const boardSize = 8; // Standard Reversi board size

export const initializeBoard = () => {
	const board = Array(boardSize)
		.fill(null)
		.map(() => Array(boardSize).fill(0)); // Use 0 for none
	// Set up the initial four stones
	board[3][3] = 1; // Use 1 for white
	board[3][4] = 2; // Use 2 for black
	board[4][3] = 2; // Use 2 for black
	board[4][4] = 1; // Use 1 for white
	return board;
};

export const Game = () => {
	const [playerColors, setPlayerColors] = useState<BoardProps["playerColors"]>([
		"",
		"black",
		"white",
	]);
	const currentPlayerRef = useRef<number>(1);
	const [globalPreview, setGlobalPreview] =
		useState<BoardProps["globalPreview"]>(true);
	const [showPreview, setShowPreview] = useState<BoardProps["showPreview"]>([
		true,
		true,
	]);
  const [board, setBoard] = useState(initializeBoard());
	const gameResult = useRef<number | null>(null);

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	const resetGame = () => {
    setBoard(initializeBoard());
    gameResult.current = null;
		currentPlayerRef.current = 1;
	};

	return (
		<div className="flex flex-col justify-center items-center">
			<HStack>
				<h2 className="text-4xl font-bold">Reversi</h2>
				<Settings
					currentPlayerRef={currentPlayerRef}
					showPreview={showPreview}
					setShowPreview={setShowPreview}
					playerColors={playerColors}
					setPlayerColors={setPlayerColors}
					globalPreview={globalPreview}
					setGlobalPreview={setGlobalPreview}
					board={board}
          setBoard={setBoard}
          gameResult={gameResult}
				/>
				<IconButton icon={<FaRedo />} onClick={resetGame} />
			</HStack>
			<p className="text-2xl">
				Current player:{" "}
				<span className="text-3xl">
					{capitalizeFirstLetter(playerColors[currentPlayerRef.current])}
				</span>
			</p>
			<Board
				currentPlayerRef={currentPlayerRef}
				showPreview={showPreview}
				setShowPreview={setShowPreview}
				playerColors={playerColors}
				setPlayerColors={setPlayerColors}
				globalPreview={globalPreview}
				setGlobalPreview={setGlobalPreview}
				board={board}
        setBoard={setBoard}
        gameResult={gameResult}
			/>
		</div>
	);
};
