import React, { Component } from 'react';

import './App.css';
import { GridImages } from './Components/GridImage/GridImages';
import { Toolbar } from './Components/Toolbar/Toolbar';
import { Imageservice } from './Services/image.service';
import { Images } from './classes/image';
import { ImageRequest, DeleteImageRequest } from './interfaces';
import { Paging } from '../src/Components/Paging/Paging';

interface AppState {
	images: Images[],
	imageRequestConfig: ImageRequest,
	selectedImages: string[],
	count: number,
	rowsPerPage: number,
	page: number,
	refreshGrid: boolean
}

class App extends Component<{}, AppState> {
	imageService: Imageservice;
	constructor(props: any) {
		super(props);
		this.state = {
			images: [],
			imageRequestConfig: {
				limit: 25,
				skip: 0
			},
			selectedImages: [],
			count: 0,
			rowsPerPage: 25,
			page: 0,
			refreshGrid: false
		};

		this.imageService = new Imageservice();
		this.handleDeleteSelectedImage = this.handleDeleteSelectedImage.bind(this);
		this.getSelectedImages = this.getSelectedImages.bind(this);
		this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
		this.onChangePage = this.onChangePage.bind(this);
		this.getImagesByFilter = this.getImagesByFilter.bind(this);
	}

	async componentDidMount() {
		//get initial data
		this.getImagesByFilter();
	}

	private async getImagesByFilter() {
		//get all images from db by filtered
		let response = await this.imageService.getAllData(this.state.imageRequestConfig);
		if (response.message === "OK") {
			//update state
			let images = response.documents.map(val => new Images(val));
			this.setState({
				images,
				count: response.count,
				refreshGrid: true
			}, () => {
				//update flag to let GridImage stop refreshing the grid
				this.setState({ refreshGrid: false });
			});
		}
	}

	/**
	 * Callback: Handle selected images changed callback
	 * @param selected selected images [id]
	 */
	getSelectedImages(selected: string[]) {
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
			.filter((img: Images) => {
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

	/**
	 * Callback: listen page change in Paging component
	 * @param newPage new page
	 */
	async onChangePage(newPage: number) {
		//setup request config
		let imageRequestConfig = {
			limit: this.state.rowsPerPage,
			skip: newPage * this.state.rowsPerPage
		}
		//update state
		this.setState({
			imageRequestConfig,
			page: newPage
		}, () => {
			//get new list of images
			this.getImagesByFilter();
		});

	}

	/**
	 * Callback: Listen action change numer of records per page in paging component
	 * @param newRowsPerPage 
	 */
	async onChangeRowsPerPage(newRowsPerPage: number) {
		//setup request config
		let imageRequestConfig = {
			limit: newRowsPerPage,
			skip: 0
		}
		//update state
		this.setState({
			imageRequestConfig,
			rowsPerPage: newRowsPerPage,
			page: 0
		}, () => {
			//get new list of images
			this.getImagesByFilter();
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
				<Paging count={this.state.count}
					page={this.state.page}
					rowsPerPage={this.state.rowsPerPage}
					onChangePage={this.onChangePage}
					onChangeRowsPerPage={this.onChangeRowsPerPage} />
				<GridImages images={images}
					getSelectedImages={this.getSelectedImages}
					refreshGrid={this.state.refreshGrid} />
			</div>
		);
	}
}

export default App; 