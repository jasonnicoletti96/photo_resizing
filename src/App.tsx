import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import CardImage from "./components/CardImage";
import { FileUploader } from "react-drag-drop-files";
import Preview from "./components/Preview";
import light from "./assets/light.svg";
import dark from "./assets/dark.svg";

export interface image {
	url: string | ArrayBuffer | null;
	name: string;
	type: string;
	size: number;
	resolution: resolution;
}

export interface resolution {
	width: number;
	height: number;
}

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "SVG"];

const resolution1: resolution = { width: 400, height: 164 };
const resolution2: resolution = { width: 512, height: 512 };

function App() {
	const [imgFileList, setImgFileList] = useState<File[]>([]);
	const [images, setImages] = useState<image[]>([]);
	const [imgPreview, setImgPreview] = useState<image | null>(null);
	const [logoDarkMode, setLogoDMode] = useState<string | null>(
		localStorage.getItem("darkMode") === null
			? "dark"
			: localStorage.getItem("darkMode")
	);

	useEffect(() => {
		if (imgFileList.length === 0) {
			return;
		}

		imgFileList.forEach(async (image) => {
			const fr = new FileReader();
			fr.readAsDataURL(image);

			fr.addEventListener("load", async () => {
				let url = fr.result;

				let resolution = await resolveProcess(url as string);
				setImages((prev) => {
					if (prev.some((image) => image.url === url)) return prev;
					return [
						...prev,
						{
							url: url,
							name: image.name,
							type: image.type,
							size: image.size,
							resolution: resolution,
						},
					];
				});
			});
		});

		setImgFileList([]);
	}, [imgFileList]);

	const OnImageChange = (files: File[]) => {
		setImgFileList((prev) => [...prev, ...files!]);
	};

	const addToBox = (
		image: image,
		index: number,
		displayed: boolean = false
	) => {
		if (displayed) {
			setImgPreview(null);
			return;
		}
		setImgPreview(image);
	};

	const addImageProcess = (url: string | ArrayBuffer | null) => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = url as string;
			image.onload = () => resolve(image);
		});
	};

	const resolveProcess = async (url: string) => {
		return await addImageProcess(url).then((img: any) => {
			return {
				width: img.width,
				height: img.height,
			};
		});
	};

	const toCanvas = (wrapper: HTMLElement, resolution: resolution) => {
		html2canvas(wrapper, {
			allowTaint: true,
			useCORS: true,
			width: resolution.width,
			height: resolution.height,
		}).then((canvas) => {
			const imgData = canvas.toDataURL("image/jpeg");
			const link = document.createElement("a");
			link.download =
				imgPreview?.name +
				"_" +
				resolution.width +
				"x" +
				resolution.height +
				".jpeg";
			link.href = imgData;
			link.click();
		});
	};

	const exportToJPEG = () => {
		if (!imgPreview) {
			alert("Impossible de télécharger sans une image");
			return;
		}
		const printWrapper1 = document.querySelector(
			".printWrapper" + resolution1.width + "x" + resolution1.height
		) as HTMLElement;
		const printWrapper2 = document.querySelector(
			".printWrapper" + resolution2.width + "x" + resolution2.height
		) as HTMLElement;

		toCanvas(printWrapper1!, resolution1);
		toCanvas(printWrapper2!, resolution2);
	};

	const toggleMode = () => {
		if (logoDarkMode === "dark") {
			setLogoDMode("light");
			localStorage.setItem("darkMode", "light");
		} else {
			localStorage.setItem("darkMode", "dark");
			setLogoDMode("dark");
		}
	};

	return (
		<div className={logoDarkMode ? logoDarkMode : "dark"}>
			<div className="box-container flex justify-between w-screen h-screen p-8 bg-white dark:bg-darkGrey">
				<div className="container-box-images relative flex flex-col items-center justify-between w-[315px] h-full p-3 pr-0 mr-8 overflow-hidden rounded-lg bg-lightGrey dark:bg-grey">
					<h2 className="w-full text-2xl font-bold text-black text-lelf dark:text-white">
						Vos images
					</h2>
					<div className="box-images relative w-full pr-5 overflow-y-scroll h-5/6 scrollbar-thin scrollbar-thumb-red scrollbar-thumb-rounded-lg scrollbar-track-white dark:scrollbar-track-darkGrey scrollbar-track-rounded-lg">
						{images.map((img, index) => {
							return (
								<CardImage
									key={index}
									img={img}
									click={() => addToBox(img, index)}
									display={imgPreview! && imgPreview.url === img.url}
								/>
							);
						})}
					</div>

					<div className="mr-3 min-h-[56px]">
						<FileUploader
							multiple
							handleChange={OnImageChange}
							classes="h-full flex drop_zone"
							hoverTitle="drop ici"
							name="file"
							types={fileTypes}
						>
							<label className="flex items-center h-full px-4 text-lg text-white rounded-lg cursor-pointer bg-red">
								Upload ou drag une image ici
							</label>
						</FileUploader>
					</div>
				</div>

				<div className="container-box-preview relative flex flex-col items-center w-5/6 h-full p-3 rounded-lg bg-lightGrey dark:bg-grey">
					<div
						onClick={toggleMode}
						className="button-dm absolute flex justify-center items-center top-5 right-5 w-12 h-12 rounded-full bg-white dark:bg-darkGrey cursor-pointer"
					>
						{logoDarkMode === "light" ? (
							<img
								src={light}
								className="w-8 h-8"
								alt="logo of dark mode"
							></img>
						) : (
							<img
								src={dark}
								className="w-8 h-8"
								alt="logo of light mode"
							></img>
						)}
					</div>

					<h2 className="w-full text-2xl font-bold text-black text-lelf dark:text-white">
						Prévisualisation
					</h2>
					<div className="flex flex-col box-preview">
						<div className="relative mb-12 mt-12 text-center">
							<Preview
								imgPreview={imgPreview}
								resolutionDefault={resolution1}
							/>
						</div>

						<div className="relative text-center">
							<Preview
								imgPreview={imgPreview}
								resolutionDefault={resolution2}
							/>
						</div>
					</div>

					<button
						className="button-save absolute self-end px-4 text-xl text-white rounded-lg h-14 bottom-3 right-3 bg-red "
						onClick={exportToJPEG}
					>
						Telecharger
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
