import { useEffect, useState } from "react";
import { image } from "../App";

interface BoxImageProps {
	img: image;
	click: () => void;
	display?: boolean;
}

const CardImage = ({ img, click, display }: BoxImageProps) => {
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (loaded) return;
		setTimeout(() => {
			setLoaded(true);
		}, 100);
	}, [loaded]);
	return loaded ? (
		<>
			<div
				onClick={click}
				className={
					"w-full h-20 p-2 flex items-center bg-white dark:bg-darkGrey rounded-lg mb-4 border-2 cursor-pointer transition-all duration-200 overflow-hidden " +
					(display
						? "border-2 border-red"
						: "border-white dark:border-darkGrey")
				}
			>
				<img
					id={img.name}
					className="object-cover w-16 h-16 mr-4 rounded-lg"
					src={img.url as string}
					alt=""
				/>

				<div className="text-box-image w-[calc(100%_-_80px)] text-sm flex flex-col text-black dark:text-white justify-end overflow-hidden transition-none">
					<span className="text-card break-all">{img.name.length > 40 ? img.name.slice(0,40)+"[...]."+img.type.split("/")[1]:img.name}</span>
					<span>
						{img.resolution?.width}x{img.resolution?.height}
					</span>
				</div>
			</div>
		</>
	) : (
		<div className="flex items-center w-full h-20 p-2 mb-4 transition-all duration-200 bg-white border-2 border-white rounded-lg cursor-pointer dark:bg-darkGrey dark:border-darkGrey animate-pulse"></div>
	);
};

export default CardImage;
