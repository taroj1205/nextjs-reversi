"use client";
import { Board } from "@/components/Board";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { Settings } from "./Settings";
import {
	Center,
	HStack,
	Heading,
	IconButton,
	Text,
	VStack,
} from "@yamada-ui/react";
import { FaRedo } from "react-icons/fa";

export interface BoardProps {
	currentPlayerRef: { current: number };
	showPreview: [boolean, boolean];
	setShowPreview: Dispatch<SetStateAction<[boolean, boolean]>>;
	playerColors: [string, string, string];
	setPlayerColors: Dispatch<SetStateAction<[string, string, string]>>;
	globalPreview: boolean;
	setGlobalPreview: Dispatch<SetStateAction<boolean>>;
	board: number[][];
	setBoard: Dispatch<SetStateAction<number[][]>>;
	gameResult: { current: number | null };
	autoPlayTimeout: number;
	setAutoPlayTimeout: Dispatch<SetStateAction<number>>;
	lastFlippedPieces: number[][];
	setLastFlippedPieces: Dispatch<SetStateAction<number[][]>>;
	lastMove: number[];
	setLastMove: Dispatch<SetStateAction<number[]>>;
	resetGame: () => void;
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

export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
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
	const [autoPlayTimeout, setAutoPlayTimeout] = useState<number>(500);
	const [lastFlippedPieces, setLastFlippedPieces] = useState<number[][]>([]);
	const [lastMove, setLastMove] = useState<number[]>([]);

	const resetGame = () => {
		setBoard(initializeBoard());
		gameResult.current = null;
		currentPlayerRef.current = 1;
		setLastFlippedPieces([]);
		setLastMove([]);
	};

	// Function to count the pieces for each player
	const countPieces = useCallback(() => {
		let whiteCount = 0;
		let blackCount = 0;

		for (let i = 0; i < boardSize; i++) {
			for (let j = 0; j < boardSize; j++) {
				if (board[i][j] === 1) whiteCount++;
				else if (board[i][j] === 2) blackCount++;
			}
		}

		return { whiteCount, blackCount };
	}, [board]);

	return (
		<Center>
			<VStack>
				<HStack as={Center}>
					<Heading as={"h2"} fontSize={"5xl"}>
						Reversi
					</Heading>
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
						autoPlayTimeout={autoPlayTimeout}
						setAutoPlayTimeout={setAutoPlayTimeout}
						lastFlippedPieces={lastFlippedPieces}
						setLastFlippedPieces={setLastFlippedPieces}
						lastMove={lastMove}
						setLastMove={setLastMove}
						resetGame={resetGame}
					/>
					<IconButton icon={<FaRedo />} onClick={resetGame} />
				</HStack>
				<HStack as={Center}>
					<Text as={Center} fontSize={"2xl"}>
						Current player:
					</Text>
					<Text fontSize="3xl">
						{capitalizeFirstLetter(playerColors[currentPlayerRef.current])}
					</Text>
				</HStack>
				<HStack as={Center}>
					{/* Game status showing the count of pieces */}
					<Text fontSize={"xl"}>White: {countPieces().whiteCount}</Text>
					<Text fontSize="xl">Black: {countPieces().blackCount}</Text>
				</HStack>

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
					autoPlayTimeout={autoPlayTimeout}
					setAutoPlayTimeout={setAutoPlayTimeout}
					lastFlippedPieces={lastFlippedPieces}
					setLastFlippedPieces={setLastFlippedPieces}
					lastMove={lastMove}
					setLastMove={setLastMove}
					resetGame={resetGame}
				/>
			</VStack>
		</Center>
	);
};
