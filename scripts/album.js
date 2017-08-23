// Variables
var albumArt = document.getElementById('albumCover'),
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

// Functions
function createSongRow(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

     var clickHandler = function() {
        var songNumber = $(this).attr('data-song-number');

        if (currentlyPlayingSong !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingCell.html(currentlyPlayingSong);
        }

        if (currentlyPlayingSong !== songNumber) {
            // Play to Pause 
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        } else if (currentlyPlayingSong === songNumber) {
            // Pause to Play
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
     };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
        }  
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
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
    $albumSongList.empty();
 
    // #4
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

$(document).ready(function() {
    setCurrentAlbum(albumHoundmouth);

    // Create array for albums
    // var albumArray = [albumPicasso, albumMarconi, albumHoundmouth],
    //     index = 0;

    // Click through albums
    // albumArt.addEventListener('click', function(){
    //     index = index + 1;
    //     index = index % albumArray.length;
    //     setCurrentAlbum(albumArray[index]);
    // });
});