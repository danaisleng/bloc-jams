// Variables
var albumArt = document.getElementById('albumCover'),
    songListContainer = document.getElementsByClassName('album-view-song-list')[0],
    songRows = document.getElementsByClassName('album-view-song-item'),
    currentlyPlayingSong = null;

// Templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

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

function createSongRow(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return $(template);
 };

function setCurrentAlbum(album) {
    // #1
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
 
    // #2
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
 
    // #3
    albumSongList.empty();
 
    // #4
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

function findParentByClassName(element, targetClass){
    var currentParent = element.parentElement;
    if (currentParent) {
        while (currentParent.className && currentParent.className != targetClass) {
            currentParent = currentParent.parentElement;
        }  

        if (currentParent.className == targetClass) {
            return currentParent;
        } else {
            console.log('No parent found with that class name.');
        };
    } else {
        console.log('No parent found.');
    };
};

function getSongItem(element){
    var elClass = element.className;

    switch(elClass) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

function clickHandler(targetElement) {
    var songItem = getSongItem(targetElement);

    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

window.onload = function() {
    setCurrentAlbum(albumHoundmouth);

    songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;        
            }
        }
    });

    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            // Revert the content back to the number
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });

        songRows[i].addEventListener('click', function(event) {
            // Event handler call
            console.log(event.target);
            clickHandler(event.target);
        });
    }

    // Create array for albums
    var albumArray = [albumPicasso, albumMarconi, albumHoundmouth],
        index = 0;

    // Click through albums
    albumArt.addEventListener('click', function(){
        index = index + 1;
        index = index % albumArray.length;
        setCurrentAlbum(albumArray[index]);
    });
};