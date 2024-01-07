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
	Radio,
	RadioGroup,
	useColorMode,
	useDisclosure,
	VStack,
	Slider,
	SliderMark,
} from "@yamada-ui/react";
import { FaCog } from "react-icons/fa";

export const Settings: React.FC<BoardProps> = ({
	showPreview,
	setShowPreview,
	playerColors,
	setPlayerColors,
	globalPreview,
	setGlobalPreview,
	autoPlayTimeout,
	setAutoPlayTimeout,
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

	const { internalColorMode, changeColorMode } = useColorMode();

	const [value, setValue] = useState<number>(5); // 5 represents 500ms

	const handleSliderChange = (value: number) => {
		setValue(value);
		setAutoPlayTimeout(value * 100); // Multiply by 100 to get the actual timeout in ms
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
						{/* <FormControl label="Change auto play time (seconds)">
							<Slider
								min={1}
								max={20}
								step={1}
								value={value}
								w={"88%"}
								ml={"6%"}
								onChange={handleSliderChange}
								my="10">
								<SliderMark value={1} w="10" ml="-5">
									0.1
								</SliderMark>
								<SliderMark value={5} w="10" ml="-5">
									0.5
								</SliderMark>
								<SliderMark value={10} w="10" ml="-5">
									1
								</SliderMark>
								<SliderMark value={15} w="10" ml="-5">
									1.5
								</SliderMark>
								<SliderMark value={20} w="10" ml="-5">
									2
								</SliderMark>
								<SliderMark
									value={value}
									bg="blue.500"
									color="white"
									py="0.5"
									rounded="md"
									w="10"
									mt="-10"
									ml="-5">
									{value / 10}
								</SliderMark>
							</Slider>
						</FormControl> */}
						<FormControl label="Change theme">
							<RadioGroup
								defaultValue={internalColorMode}
								onChange={changeColorMode}>
								<Radio value="light">Light</Radio>
								<Radio value="dark">Dark</Radio>
								<Radio value="system">System</Radio>
							</RadioGroup>
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
