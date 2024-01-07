import { Game } from "@/components/Game";
import { Suspense } from "react";

const Home = () => {
	return (
		<div className="flex flex-col justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Game />
      </Suspense>
		</div>
	);
};

export default Home;
