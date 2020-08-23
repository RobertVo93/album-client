import PropTypes from 'prop-types';
import React from 'react';
import Gallery from 'react-grid-gallery';
import { CheckButton } from './CheckButton';

export class GridImages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: this.props.images,
            selectAllChecked: false
        };

        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
        this.onClickSelectAll = this.onClickSelectAll.bind(this);
    }

    componentDidUpdate = () => {
        if (this.props.refreshGrid) {
            //only update grid when the parent component force to update
            this.setState({
                images: this.props.images,
                selectAllChecked: false
            });
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
        //get the selected image
        var images = this.state.images.slice();
        var img = images[index];
        //reverse flag of that image
        img.isSelected = img.hasOwnProperty("isSelected") ? !img.isSelected : true;
        //update state
        this.setState({
            images: images,
            selectAllChecked: this.allImagesSelected(images)
        });
    }

    /**
     * Get all selected images
     */
    getSelectedImages() {
        //get list of id of selected images
        let selectedImages = [];
        for (var i = 0; i < this.state.images.length; i++) {
            if (this.state.images[i].isSelected === true) {
                selectedImages.push(this.state.images[i].id);
            }
        }
        //call the props callback function
        this.props.getSelectedImages(selectedImages);
        return selectedImages;
    }

    /**
     * Handle onclick [select all] checkbox
     */
    onClickSelectAll() {
        //reverse checkbox selection
        var selectAllChecked = !this.state.selectAllChecked;
        //update all images in current page
        var images = this.state.images.slice();
        for (var i = 0; i < this.state.images.length; i++)
            images[i].isSelected = selectAllChecked;
        //update state
        this.setState({
            images: images,
            selectAllChecked: selectAllChecked
        });
    }

    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <CheckButton
                    index={0}
                    isSelected={this.state.selectAllChecked}
                    onClick={this.onClickSelectAll}
                    parentHover={true}
                    color={"rgba(0,0,0,0.54)"}
                    selectedColor={"#4285f4"}
                    hoverColor={"rgba(0,0,0,0.54)"} />
                <div style={SelectAllStyle}>
                    select all
                </div>
                <div style={SelectedImageStyle}>Selected images: {this.getSelectedImages().length}</div>
                <div style={GalaryContainerStyle}>
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
    getSelectedImages: PropTypes.func.isRequired,
    refreshGrid: PropTypes.bool.isRequired
};

const SelectAllStyle = {
    height: "36px",
    display: "flex",
    alignItems: "center"
}

const SelectedImageStyle = {
    padding: "2px",
    color: "#666"
}

const GalaryContainerStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
}