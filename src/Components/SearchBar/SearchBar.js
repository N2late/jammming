import React from "react";
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            term: ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    componentDidMount() {
        let data = JSON.parse(localStorage.getItem('value'));
        this.setState({ term: data });
    } 

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({ term: e.target.value });
    }

    componentDidUpdate() {
        localStorage.setItem('value', JSON.stringify(this.state.term));
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" value={this.state.term} onChange={this.handleTermChange}/>
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}