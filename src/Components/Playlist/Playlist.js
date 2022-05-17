import React from "react";
import './Playlist.css';
import { TrackList } from "../TrackList/TrackList";

export class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        let newName = e.target.value;
        this.props.changePlaylistName(newName);
    }

    render() {
        return (
            <div className="Playlist">
                <input value={this.props.playlistName} onChange={this.handleChange}/>
                <TrackList playlistName={this.props.playlistName} tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className='Playlist-save' onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}