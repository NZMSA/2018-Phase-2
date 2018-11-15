import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentMeme: any
}

interface IState {
    open: boolean
}

export default class MemeDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

    }

	public render() {
        const currentMeme = this.props.currentMeme
        const { open } = this.state;
		return (
			<div className="container meme-wrapper">
                <div className="row meme-heading">
                    <b>{currentMeme.title}</b>&nbsp; ({currentMeme.tags})
                </div>
                <div className="row meme-date">
                    {currentMeme.uploaded}
                </div>
                <div className="row meme-img">
                    <img src={currentMeme.url}/>
                </div>
                
                <div className="row meme-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadMeme.bind(this, currentMeme.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.methodNotImplemented.bind(this, currentMeme.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Meme Title</label>
                            <input type="text" className="form-control" id="meme-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any meme later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="meme-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.methodNotImplemented}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };
    
    private methodNotImplemented() {
		alert("Method not implemented")
	}

    // Open meme image in new tab
    private downloadMeme(url: any) {
        window.open(url);
    }
}