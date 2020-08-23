import React from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import './Toolbar.css';
import { KeyValue } from '../../interfaces/KeyValue';
import { Albums } from '../../Configuration/Enum';
import { Imageservice } from '../../Services/image.service';

interface ToolbarProps {
    onClickDelete: () => void,
    noSelectedImages?: number
}

interface ToolbarState {
    album: string,
    open: boolean,
    selectedFile: any[],
    albumOptions: KeyValue<string, string>[]
}

export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
    imageService: Imageservice;
    constructor(props: any) {
        super(props);
        this.state = {
            open: false,
            selectedFile: [],
            albumOptions: [
                { Key: Albums.travel, Value: Albums.travel },
                { Key: Albums.personal, Value: Albums.personal },
                { Key: Albums.food, Value: Albums.food },
                { Key: Albums.nature, Value: Albums.nature },
                { Key: Albums.other, Value: Albums.other }
            ],
            album: Albums.travel
        }
        this.imageService = new Imageservice();
    }

    /**
     * fire event onclick upload button
     */
    onClickUpload = () => {
        this.setState({ open: true });
    }

    /**
     * fire event onclick delete button
     */
    onClickDelete = () => {
        this.props.onClickDelete();
    }

    /**
     * Handle close modal
     */
    onCloseModal = () => {
        this.setState({ open: false });
    }

    /**
     * Handle action select album
     * @param event event
     */
    onSelectAlbumChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.setState({
            album: event.target.value as string
        });
    }

    /**
     * update selected files to state
     * @param event 
     */
    onFileChange = (event: any) => {
        this.setState({
            selectedFile: event.target.files
        });
    }

    /**
     * Handle action upload file
     */
    onFileUpload = () => {
        if (this.state.selectedFile.length > 0) {
            // Create the formData object with album and the uploaded files
            const formData = new FormData();
            formData.append("album", this.state.album);
            let loopNumber = this.state.selectedFile.length;
            //append all files to FormData object
            for (let index = 0; index < loopNumber; index++) {
                let file = this.state.selectedFile[index];
                //rename the upload files
                let newName = `${new Date().getTime()} - ${file.name}`;
                let newFile = new File([file], newName);
                formData.append("documents", newFile);
            }
            // Send API with formData object to server
            this.imageService.createNew(formData)
                .then((result) => {
                    window.location.reload();
                });
        }
    }

    render() {
        return (
            <div style={ContainerStyle}>
                <div className="float-left">
                    <h2>Photos</h2>
                </div>
                <div style={RightContainerStyle}>
                    {
                        this.props.noSelectedImages ?
                            (
                                <div style={RightToolbarStyle}>
                                    <Button
                                        onClick={this.onClickDelete}
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ) : ('')
                    }
                    <div style={RightToolbarStyle}>
                        <Button
                            onClick={this.onClickUpload}
                            variant="contained"
                            color="default"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
                <Modal
                    style={ModalStyle}
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={this.state.open}
                    onClose={this.onCloseModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.open}>
                        <div style={PaperStyle}>
                            <div className="header" style={ModalHeaderStyle}>
                                <div className="float-left"><h3>Upload photos</h3></div>
                                <div className="close-popup-button"><div onClick={() => this.onCloseModal()}>X</div></div>
                            </div>
                            <div className="modal-body">
                                <div className="custom-file">
                                    <p className="drag-drop-label">
                                        {
                                            this.state.selectedFile && this.state.selectedFile.length > 0 ?
                                                (`Selected: ${this.state.selectedFile.length} file(s)`)
                                                :
                                                (`Drag 'n' drop some files here, or click to select files`)
                                        }
                                    </p>
                                    <input className="custom-file-name-textbox"
                                        onChange={this.onFileChange} multiple
                                        id="inputGroupFile01" name="images" type="file" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <FormControl className="float-left album-select">
                                    <Select
                                        value={this.state.album}
                                        onChange={this.onSelectAlbumChange}
                                    >
                                        {
                                            this.state.albumOptions.map((val) => (
                                                <MenuItem key={val.Key} value={val.Key}>{val.Value}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button
                                    onClick={this.onFileUpload}
                                    className="float-right"
                                    variant="contained"
                                    color="default"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload
                                </Button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        );
    }
}
const ContainerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '100%',
    margin: '0 10px 0 10px',
    paddingTop: 30
}

const RightContainerStyle: React.CSSProperties = {
    display: 'flex',
    float: 'right',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 75
}

const RightToolbarStyle: React.CSSProperties = {
    display: 'inline-block',
    margin: '0 10px 0 10px'
}

const ModalStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    margin: 'auto'
}

const PaperStyle: React.CSSProperties = {
    border: '2px solid #000',
    backgroundColor: '#ffffff',
    padding: 25,
    width: '100%'
}

const ModalHeaderStyle: React.CSSProperties = {
    width: '100%',
    display: 'inline-block'
}