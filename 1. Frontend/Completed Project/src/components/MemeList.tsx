import * as React from "react";

interface IProps {
    memes: any[],
    selectNewMeme: any,
    searchByTag: any
}

export default class MemeList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
    }

	public render() {
		return (
			<div className="container meme-list-wrapper">
                <div className="row meme-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                        </div>
                    </div>  
                </div>
                <div className="row meme-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Construct table using meme list
	private createTable() {
        const table:any[] = []
        const memeList = this.props.memes
        if (memeList == null) {
            return table
        }

        for (let i = 0; i < memeList.length; i++) {
            const children = []
            const meme = memeList[i]
            children.push(<td key={"id" + i}>{meme.id}</td>)
            children.push(<td key={"name" + i}>{meme.title}</td>)
            children.push(<td key={"tags" + i}>{meme.tags}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    // Meme selection handler to display selected meme in details component
    private selectRow(index: any) {
        const selectedMeme = this.props.memes[index]
        if (selectedMeme != null) {
            this.props.selectNewMeme(selectedMeme)
        }
    }

    // Search meme by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

}