"use client";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
	useRef,
} from "react";
import {
	BoardProps,
	boardSize,
	capitalizeFirstLetter,
	initializeBoard,
} from "./Game";
import {
	AspectRatio,
	Button,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	Text,
	useDisclosure,
	useNotice,
} from "@yamada-ui/react";
import { FaRedo } from "react-icons/fa";
import AutoPlayButton from "./AutoPlayButton";

export const Board: React.FC<BoardProps> = ({
	currentPlayerRef,
	showPreview,
	playerColors,
	globalPreview,
	board,
	setBoard,
	gameResult,
	autoPlayTimeout,
	lastFlippedPieces,
	setLastFlippedPieces,
	lastMove,
	setLastMove,
	resetGame,
	isOpen,
	onClose,
	onOpen,
	setPrevBlackCount,
	setPrevWhiteCount,
	setPrevBlackDifference,
	setPrevWhiteDifference,
	prevBlackCount,
	prevWhiteCount,
}) => {
	const [validMoves, setValidMoves] = useState<number[][]>([]);
	const [showPreviewAfterMove, setShowPreviewAfterMove] = useState(true);

	// Directions to check for valid moves
	const directions = useMemo(
		() => [
			[-1, 0], // up
			[1, 0], // down
			[0, -1], // left
			[0, 1], // right
			[-1, -1], // up-left
			[-1, 1], // up-right
			[1, -1], // down-left
			[1, 1], // down-right
		],
		[]
	);

	// Function to check if a move is valid
	const isValidMove = useCallback(
		(board: number[][], row: number, col: number, player: number) => {
			if (board[row][col] !== 0) return false; // Cell is not empty

			for (let [dx, dy] of directions) {
				let x = row + dx;
				let y = col + dy;
				if (
					x >= 0 &&
					x < boardSize &&
					y >= 0 &&
					y < boardSize && // Cell is inside the board
					board[x][y] === (player % 2) + 1 // Cell is occupied by the opponent
				) {
					while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
						if (board[x][y] === player) return true; // Found a piece of the current player
						x += dx;
						y += dy;
					}
				}
			}

			return false;
		},
		[directions]
	);

	const getValidMoves = useCallback(
		(board: number[][], player: number) => {
			let moves = [];
			for (let i = 0; i < boardSize; i++) {
				for (let j = 0; j < boardSize; j++) {
					if (isValidMove(board, i, j, player)) {
						moves.push([i, j]);
					}
				}
			}
			if (JSON.stringify(moves) !== JSON.stringify(validMoves)) {
				setValidMoves(moves);
			}
			return moves;
		},
		[isValidMove, validMoves]
	);

	useEffect(() => {
		if (!gameResult.current) {
			getValidMoves(board, currentPlayerRef.current);
		}
	}, [board, currentPlayerRef, gameResult, getValidMoves]);
	const checkWin = useCallback(() => {
		let whiteCount = 0;
		let blackCount = 0;
		let emptyCount = 0;

		for (let i = 0; i < boardSize; i++) {
			for (let j = 0; j < boardSize; j++) {
				if (board[i][j] === 1) whiteCount++;
				else if (board[i][j] === 2) blackCount++;
				else emptyCount++;
			}
		}

		if (emptyCount === 0 || whiteCount === 0 || blackCount === 0) {
			let result;
			if (whiteCount > blackCount) result = 2; // White wins
			else if (blackCount > whiteCount) result = 1; // Black wins
			else result = 0; // Draw

			gameResult.current = result;
			onOpen();
		}

		return -1; // Game is not over
	}, [board, gameResult, onOpen]);

	useEffect(() => {
		const result = checkWin();
		if (result !== -1) {
			// Handle the end of the game
			console.log(result === 0 ? "Draw" : `Player ${result} wins`);
		}
	}, [board, checkWin]);

	// Function to flip the opponent's pieces
	const flipPieces = (
		board: number[][],
		row: number,
		col: number,
		player: number
	) => {
		let flippedPieces: number[][] = [];
		for (let [dx, dy] of directions) {
			let x = row + dx;
			let y = col + dy;
			if (
				x >= 0 &&
				x < boardSize &&
				y >= 0 &&
				y < boardSize && // Cell is inside the board
				board[x][y] === (player % 2) + 1 // Cell is occupied by the opponent
			) {
				let x2 = x;
				let y2 = y;
				while (x2 >= 0 && x2 < boardSize && y2 >= 0 && y2 < boardSize) {
					if (board[x2][y2] === player) {
						// Found a piece of the current player
						// Flip the opponent's pieces
						while (x !== x2 || y !== y2) {
							board[x][y] = player;
							flippedPieces.push([x, y]); // Add the flipped piece to the array
							x += dx;
							y += dy;
						}
						break;
					}
					x2 += dx;
					y2 += dy;
				}
			}
		}
		return flippedPieces;
	};

	const notice = useNotice({ limit: 2 });

	const handleClick = (rowIndex: number, cellIndex: number) => {
		if (isValidMove(board, rowIndex, cellIndex, currentPlayerRef.current)) {
			const { blackCount, whiteCount } = countPieces();
			setPrevBlackCount(blackCount);
			setPrevBlackDifference(blackCount - prevBlackCount);
			setPrevWhiteCount(whiteCount);
			setPrevWhiteDifference(whiteCount - prevWhiteCount);
			const newBoard = [...board];
			newBoard[rowIndex][cellIndex] = currentPlayerRef.current;
			const flippedPieces = flipPieces(
				newBoard,
				rowIndex,
				cellIndex,
				currentPlayerRef.current
			);
			setLastFlippedPieces(flippedPieces);
			setBoard(newBoard);
			setLastMove([rowIndex, cellIndex]); // Update the last move

			currentPlayerRef.current = currentPlayerRef.current === 1 ? 2 : 1; // Switch the current player

			setShowPreviewAfterMove(true);
		}
	};

	useEffect(() => {
		if (!gameResult.current) {
			getValidMoves(board, currentPlayerRef.current);
			const moves = getValidMoves(board, currentPlayerRef.current);
			if (moves.length === 0) {
				// No valid moves for the current player, switch to the other player
				currentPlayerRef.current = currentPlayerRef.current === 1 ? 2 : 1;
				notice({
					title: "No valid moves",
					description: `Player ${currentPlayerRef.current} has no valid moves. Skipping their turn.`,
					status: "warning",
					variant: "subtle",
					isClosable: true,
				});
			}
		}
	}, [board, currentPlayerRef, gameResult, getValidMoves, notice]);

	const isPreviewVisible = (
		player: number,
		rowIndex: number,
		cellIndex: number
	) =>
		showPreviewAfterMove &&
		showPreview[player - 1] &&
		currentPlayerRef.current === player &&
		validMoves.some(([x, y]) => x === rowIndex && y === cellIndex);

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

	// Calculate the percentage of white pieces
	const totalPieces = countPieces().whiteCount + countPieces().blackCount;
	const whitePercentage =
		totalPieces > 0 ? (countPieces().whiteCount / totalPieces) * 100 : 0;

	return (
		<>
			<div className="grid grid-cols-8 gap-1 bg-green-700 aspect-square p-4">
				{board.map((row, rowIndex) =>
					row.map((cell, cellIndex) => (
						<div
							key={`${rowIndex}-${cellIndex}`}
							className={`w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 flex justify-center items-center cursor-pointer relative transition-colors duration-300 
                ${
									rowIndex === lastMove[0] && cellIndex === lastMove[1]
										? "bg-red-500"
										: lastFlippedPieces.some(
												([row, col]) => row === rowIndex && col === cellIndex
										  )
										? "bg-yellow-500"
										: "bg-green-500"
								}`}
							onClick={() => handleClick(rowIndex, cellIndex)}>
							{cell !== 0 && (
								<div
									key={`${rowIndex}-${cellIndex}-${currentPlayerRef.current}`}
									className={`
										rounded-full 
										w-10 sm:w-12 md:w-16 lg:w-20 
										h-10 sm:h-12 md:h-16 lg:h-20 
										${playerColors[cell] === "black" ? "bg-black" : "bg-white"}
										${
											lastFlippedPieces.some(
												([row, col]) => row === rowIndex && col === cellIndex
											)
												? "flip"
												: ""
										}
									`}></div>
							)}
							{cell === 0 &&
								(isPreviewVisible(1, rowIndex, cellIndex) ? (
									<div className="rounded-full w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 bg-opacity-30 bg-black"></div>
								) : isPreviewVisible(2, rowIndex, cellIndex) ? (
									<div className="rounded-full w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 bg-opacity-50 bg-white"></div>
								) : null)}
							{rowIndex === 1 && cellIndex === 1 && (
								<div className="absolute bottom-0 right-0 -mb-1.5 -mr-1.5 bg-black rounded-full w-2 h-2 z-10"></div>
							)}
							{rowIndex === 6 && cellIndex === 1 && (
								<div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 bg-black rounded-full w-2 h-2 z-10"></div>
							)}
							{rowIndex === 6 && cellIndex === 6 && (
								<div className="absolute top-0 left-0 -mt-1.5 -ml-1.5 bg-black rounded-full w-2 h-2 z-10"></div>
							)}
							{rowIndex === 1 && cellIndex === 6 && (
								<div className="absolute bottom-0 left-0 -mb-1.5 -ml-1.5 bg-black rounded-full w-2 h-2 z-10"></div>
							)}
						</div>
					))
				)}
			</div>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalHeader>Game Over</ModalHeader>
				<ModalBody>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{gameResult.current === 0
							? "Draw!"
							: gameResult.current !== null
							? `${capitalizeFirstLetter(
									playerColors[gameResult.current]
							  )} wins!`
							: null}
					</Text>
					{/* Display the counts */}
					<Text>White pieces: {countPieces().whiteCount}</Text>
					<Text>Black pieces: {countPieces().blackCount}</Text>

					<Progress
						value={whitePercentage}
						filledTrackColor={"white"}
						borderRadius={"sm"}
					/>
				</ModalBody>
				<ModalFooter>
					<IconButton icon={<FaRedo />} onClick={resetGame} />
					<Button variant="ghost" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};
