import React, { Component } from 'react';

import './App.css';
import { GridImages } from './Components/GridImages';
import { Toolbar } from './Components/Toolbar/Toolbar';
import { Imageservice } from './Services/image.service';
import { Images } from './classes/image';
import { ImageRequest, DeleteImageRequest } from './interfaces';

interface AppState {
	selectedFile: any,
	images: Images[],
	imageRequestConfig: ImageRequest,
	selectedImages: string[]
}

class App extends Component<{}, AppState> {
	imageService: Imageservice;
	constructor(props: any) {
		super(props);
		this.state = {
			selectedFile: null,
			images: [],
			imageRequestConfig: {
				limit: 25,
				skip: 0
			},
			selectedImages: []
		};

		this.imageService = new Imageservice();
		this.handleDeleteSelectedImage = this.handleDeleteSelectedImage.bind(this);
		this.getSelectedImages = this.getSelectedImages.bind(this);
	}

	async componentDidMount() {
		//get all images from db
		let response = await this.imageService.getAllData(this.state.imageRequestConfig);
		if (response.message === "OK") {
			let images = response.documents.map(val => new Images(val));
			this.setState({ images });
		}
	}

	/**
	 * Callback: Handle selected images changed callback
	 * @param selected selected images [id]
	 */
	getSelectedImages = (selected: string[]) => {
		//check if selected images are changed
		if (JSON.stringify(selected) !== JSON.stringify(this.state.selectedImages)) {
			this.setState({
				selectedImages: selected
			});
		}
	}

	/**
	 * Callback: Handle delete the selected images
	 */
	async handleDeleteSelectedImage() {
		if (this.state.selectedImages.length === 0)
			return;
		//define delete request object
		let deleteRequest: DeleteImageRequest[] = [];
		//group all deleted images by album
		let group = this.state.images
		.filter((img: Images)=> {
			//get all selected images object by their id
			return this.state.selectedImages.indexOf(img.id) !== -1;
		}).reduce((gr: any, ele) => {
			//group them by album
			gr[ele.album] = [...gr[ele.album] || [], ele];
			return gr;
		}, {});

		//setup delete request object
		for (let key in group) {
			deleteRequest.push({
				album: key,
				documents: group[key].map((img: Images) => img.name).join(', ')
			});
		}
		//send API
		this.imageService.deleteBulk(deleteRequest).then((res) => {
			if (res.message === "OK") {
				window.location.reload();
			}
		});
	}

	render() {
		//Update display value for thumbnail Caption of each image
		let images = this.state.images.map((img: Images) => {
			img.thumbnailCaption = (
				<div>
					<div><strong>{img.name}</strong></div>
					<div>{img.album}</div>
				</div>
			);
			return img;
		});
		return (
			<div style={{
				width: '80%',
				margin: 'auto'
			}}>
				<Toolbar onClickDelete={this.handleDeleteSelectedImage} noSelectedImages={this.state.selectedImages.length} />
				<GridImages images={images} getSelectedImages={this.getSelectedImages} />
			</div>
		);
	}
}

export default App; 