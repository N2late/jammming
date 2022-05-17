import './App.css';
import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.changePlaylistName = this.changePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
       return;
    }
    this.state.playlistTracks.push(track);
    let playlistUpdated = this.state.playlistTracks
    this.setState({playlistTracks: playlistUpdated})
  }

  removeTrack(track) {
    const index = this.state.playlistTracks.indexOf(track)
    if (index > -1) {
      this.state.playlistTracks.splice(index, 1)
    }
    this.setState({playlistTracks: this.state.playlistTracks})
  }

  changePlaylistName(newName) {
    this.setState({playlistName: newName})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri); 
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => { 
      this.setState({ searchResults: searchResults })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search}/>
          <div className='App-playlist'>
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} 
            changePlaylistName={this.changePlaylistName}
            onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
