import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { KeyValue } from '../../interfaces';

interface PagingProps {
    count: number,
    rowsPerPage: number,
    page: number,
    onChangePage: (newPage: number) => void,
    onChangeRowsPerPage: (newRowsPerPage: number) => void
}

interface PagingState {
    rowsPerPageOptions: KeyValue<number, number>[]
}

export class Paging extends React.Component<PagingProps, PagingState> {
    constructor(props: PagingProps) {
        super(props);

        this.state = {
            rowsPerPageOptions: [
                { Key: 10, Value: 10 },
                { Key: 25, Value: 25 },
                { Key: 50, Value: 50 },
                { Key: 100, Value: 100 }
            ]
        }
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
    /**
     * Handle action go to the previous page
     */
    handleBackButtonClick = () => {
        this.props.onChangePage(this.props.page - 1);
    }

    /**
     * Handle action go to the next page
     */
    handleNextButtonClick = () => {
        this.props.onChangePage(this.props.page + 1);
    }

    /**
     * Handle action change number of records per page
     * @param event react change event
     */
    handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.props.onChangeRowsPerPage(event.target.value as number);
    }

    render() {
        return (
            <div className="width100">
                <div className="float-right">
                    <div style={PagingCellStyle}>Rows per page:</div>
                    <div style={PagingCellStyle}>
                        <FormControl style={{width: 60}}>
                            <Select
                                style={{width: 60}}
                                value={this.props.rowsPerPage}
                                onChange={this.handleChangeRowsPerPage}
                            >
                                {
                                    this.state.rowsPerPageOptions.map((val) => (
                                        <MenuItem key={val.Key} value={val.Key}>{val.Value}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div style={PagingCellStyle}>
                        <IconButton
                            onClick={this.handleBackButtonClick}
                            disabled={this.props.page === 0}
                            aria-label="previous page"
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <IconButton
                            onClick={this.handleNextButtonClick}
                            disabled={this.props.count < this.props.rowsPerPage}
                            aria-label="next page"
                        >
                            <KeyboardArrowRight />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

const PagingCellStyle: React.CSSProperties = {
    display: 'inline-block',
    margin: '0 10px 0 10px'
}