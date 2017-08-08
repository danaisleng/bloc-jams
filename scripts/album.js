var albumArt = document.getElementById('albumCover'),
    i = 0;

var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumHoundmouth = {
    title: 'Little Neon Limelight',
    artist: 'Houndmouth',
    label: 'Rough Trade Records',
    year: '2015',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Sedona', duration: '4:15' },
        { title: 'Black Gold', duration: '3:41' },
        { title: 'By God', duration: '3:16'},
        { title: 'Otis', duration: '3:12' },
        { title: 'Honey Slider', duration: '3:36'},
        { title: 'Say It', duration: '3:23'},
        { title: '15 Years', duration: '3:08'},
        { title: 'My Cousin Greg', duration: '3:57'},
        { title: 'Darlin', duration: '4:19'},
        { title: 'For No One', duration: '3:50'},
        { title: 'Gasoline', duration: '2:51'}
    ]
};

var albumArray = [albumPicasso, albumMarconi, albumHoundmouth];

function createSongRow(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

function setCurrentAlbum(album) {
    // #1
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
    // #2
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
 
    // #3
    albumSongList.innerHTML = '';
 
    // #4
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};
 
window.onload = function() {
    setCurrentAlbum(albumHoundmouth);
};


albumArt.addEventListener('click', function(){
    i = i + 1;
    i = i % albumArray.length;
    setCurrentAlbum(albumArray[i]);
});