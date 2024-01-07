import { useState } from "react";
import { BoardProps } from "./Game";
import {
	Button,
	Checkbox,
	CheckboxGroup,
	FormControl,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	VStack,
} from "@yamada-ui/react";
import { FaCog } from "react-icons/fa";

export const Settings: React.FC<BoardProps> = ({
	showPreview,
	setShowPreview,
	playerColors,
  setPlayerColors,
  globalPreview,
  setGlobalPreview,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const togglePreview = (index: number) => {
		if (index === -1) {
			setGlobalPreview(!globalPreview);
			setShowPreview([!globalPreview, !globalPreview]);
		} else {
			const newShowPreview: [boolean, boolean] = [...showPreview];
			newShowPreview[index] = !newShowPreview[index];
			setShowPreview(newShowPreview);
		}
	};

	const changeColor = (index: number, color: string) => {
		const newPlayerColors: [string, string, string] = [...playerColors];
		newPlayerColors[index] = color;
		setPlayerColors(newPlayerColors);
	};

	return (
		<>
			<IconButton icon={<FaCog />} onClick={onOpen} />

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalHeader>Settings</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack>
						<FormControl label="Preview toggle">
							<CheckboxGroup>
								<Checkbox
									isChecked={globalPreview}
									onChange={() => togglePreview(-1)}>
									Toggle all
								</Checkbox>
								<Checkbox
									isChecked={showPreview[0]}
									onChange={() => togglePreview(0)}
									isDisabled={globalPreview}>
									Toggle for player 1
								</Checkbox>
								<Checkbox
									isChecked={showPreview[1]}
									onChange={() => togglePreview(1)}
									isDisabled={globalPreview}>
									Toggle for player 2
								</Checkbox>
							</CheckboxGroup>
						</FormControl>
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};
