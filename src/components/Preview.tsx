import styled from "@emotion/styled";
import { Slider } from "@mantine/core";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { image, resolution } from "../App";

const StyledSlider = styled(Slider)`
	& .mantine-Slider-bar {
		background-color: #d9230f;
	}

	& .mantine-Slider-thumb {
		border-color: #d9230f;
		background-color: #d9230f;
		width: 15px;
		height: 15px;
	}
	& .mantine-Slider-track::before {
		background-color: grey;
	}
`;

interface PreviewProps {
	imgPreview: image | null;
	resolutionDefault: resolution;
}

const Preview = ({ imgPreview, resolutionDefault }: PreviewProps) => {
	const [width, setWidth] = useState<string>("0");

	useEffect(() => {
		if (imgPreview) setWidth(imgPreview.resolution.width.toString());
	}, [imgPreview]);

	return (
		<>
			<div className="flex flex-col items-center">
				<StyledSlider
					value={parseInt(width)}
					onChange={(value) => setWidth(value.toString())}
					label={(value) =>
						imgPreview
							? `${value}x${(
									imgPreview!.resolution.height /
									(imgPreview!.resolution.width / parseInt(width))
							  ).toFixed(0)}`
							: 0
					}
					className="w-48 mb-1 "
					min={resolutionDefault.width}
					max={imgPreview ? imgPreview.resolution.width + 1000 : 1000}
				/>

				<div
					style={{
						width: 	resolutionDefault.width +"px",
						height: resolutionDefault.height+"px"
					}}
					className={
						"printWrapper" +
						resolutionDefault.width +
						"x" +
						resolutionDefault.height +
						" relative bg-white shadow-md shadow-darkGrey  mb-2 overflow-hidden"
					}
				>
					{imgPreview ? (
						<div className="relative">
							<Draggable handle=".handle">
								<div
									draggable={false}
									style={{ width: width + "px", height: "auto" }}
								>
									<img
										className="w-full h-full cursor-move handle"
										draggable={false}
										src={imgPreview.url as string}
										alt="content"
									/>
								</div>
							</Draggable>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>

			<span className="font-bold text-red ">
				{resolutionDefault.width}x{resolutionDefault.height}
			</span>
		</>
	);
};

export default Preview;
