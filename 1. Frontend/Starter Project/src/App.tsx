import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import MemeDetail from './components/MemeDetail';
import MemeList from './components/MemeList';
import PatrickLogo from './patrick-logo.png';


interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentMeme: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			memes: [],
			open: false,
			uploadFileList: null
		}     	
		this.selectNewMeme = this.selectNewMeme.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={PatrickLogo} height='40'/>&nbsp; My Meme Bank - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Meme</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<MemeDetail currentMeme={this.state.currentMeme} />
					</div>
					<div className="col-5">
						<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.methodNotImplemented}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Meme Title</label>
						<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
						<small className="form-text text-muted">You can edit any meme later</small>
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used for search</small>
					</div>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.methodNotImplemented} className="form-control-file" id="meme-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.methodNotImplemented}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	private methodNotImplemented() {
		alert("Method not implemented")
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}
}

export default App;
