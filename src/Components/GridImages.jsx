import PropTypes from 'prop-types';
import React from 'react';
import Gallery from 'react-grid-gallery';
import { CheckButton } from './CheckButton';

export class GridImages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: this.props.images,
            originalImages: this.props.images,
            selectAllChecked: false
        };

        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
        this.onClickSelectAll = this.onClickSelectAll.bind(this);
    }

    componentDidUpdate = () => {
        if (this.state.originalImages !== this.props.images) {
            this.setState({
                images: this.props.images,
                selectAllChecked: false,
                originalImages: this.props.images
            })
        }
    }

    /**
     * check list images (parameter) are all selected
     * @param {*} images list images
     */
    allImagesSelected(images) {
        var f = images.filter((img) => {
            return img.isSelected === true;
        });
        return f.length === images.length;
    }

    /**
     * Handle select image
     * @param {*} index index of selected image
     */
    onSelectImage(index) {
        var images = this.state.images.slice();
        var img = images[index];

        img.isSelected = img.hasOwnProperty("isSelected") ? !img.isSelected : true;

        this.setState({
            images: images,
            selectAllChecked: this.allImagesSelected(images)
        });
    }

    /**
     * Get all selected images
     */
    getSelectedImages() {
        var selectedIndex = [];
        let selectedImages = [];
        for (var i = 0; i < this.state.images.length; i++){
            if (this.state.images[i].isSelected === true){
                selectedIndex.push(i);
                selectedImages.push(this.state.images[i].id);
            }
        }
        this.props.getSelectedImages(selectedImages);
        return selectedIndex;
    }

    /**
     * Handle onclick [select all] checkbox
     */
    onClickSelectAll() {
        var selectAllChecked = !this.state.selectAllChecked;
        this.setState({
            selectAllChecked: selectAllChecked
        });

        var images = this.state.images.slice();
        for (var i = 0; i < this.state.images.length; i++)
                images[i].isSelected = selectAllChecked;
        // if (selectAllChecked) {
        //     for (var i = 0; i < this.state.images.length; i++)
        //         images[i].isSelected = true;
        // }
        // else {
        //     for (var i = 0; i < this.state.images.length; i++)
        //         images[i].isSelected = false;

        // }
        this.setState({
            images: images
        });
    }

    render() {
        return (
            <div style={{textAlign: "center"}}>
                <CheckButton
                    index={0}
                    isSelected={this.state.selectAllChecked}
                    onClick={this.onClickSelectAll}
                    parentHover={true}
                    color={"rgba(0,0,0,0.54)"}
                    selectedColor={"#4285f4"}
                    hoverColor={"rgba(0,0,0,0.54)"} />
                <div style={{
                    height: "36px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    select all
                </div>
                <div style={{
                    padding: "2px",
                    color: "#666"
                }}>Selected images: {this.getSelectedImages().toString()}</div>
                <div style={{
                    display: "block",
                    minHeight: "1px",
                    width: "100%",
                    border: "1px solid #ddd",
                    overflow: "auto"
                }}>
                    <Gallery
                        images={this.state.images}
                        onSelectImage={this.onSelectImage}
                        showLightboxThumbnails={true} />
                </div>
            </div>
        );
    }
}

GridImages.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            srcset: PropTypes.array,
            caption: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.element
            ]),
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
            isSelected: PropTypes.bool
        })
    ).isRequired,
    getSelectedImages: PropTypes.func.isRequired
};