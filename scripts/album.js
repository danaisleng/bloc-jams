// Variables
var albumArt = document.getElementById('albumCover'),
    currentAlbum = null,
    currentlyPlayingSongNumber = null,
    currentSongFromAlbum = null,
    currentSoundFile = null,
    currentVolume = 80,
    $previousButton = $('.main-controls .previous'),
    $nextButton = $('.main-controls .next');


// Templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playerBarPlayButton = '<span class="ion-play"></span>',
    playerBarPauseButton = '<span class="ion-pause"></span>';

// Functions
function createSongRow(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';
 
     var $row = $(template);

     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Play to Pause 
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Pause to Play
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                setSong(songNumber);
                currentSoundFile.play();    
            } else {
                $(this).html(playButtonTemplate);
                currentSoundFile.pause();
            };
            
            $('.main-controls .play-pause').html(playerBarPlayButton);
        }

        updatePlayerBarSong();
     };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }  
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

function setSong(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });

    setVolume(currentVolume);
};

function setVolume(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

function getSongNumberCell(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

function setCurrentAlbum(album) {
    currentAlbum = album;

    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
 
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

function trackIndex(album, song) {
    return album.songs.indexOf(song);
};

function nextSong() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var albumLength = currentAlbum.songs.length;

    currentSongIndex++;

    if (currentSongIndex >= albumLength) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();


    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber) ;

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

function previousSong() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var albumLength = currentAlbum.songs.length;

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = albumLength - 1;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();

    updatePlayerBarSong();

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

function updatePlayerBarSong() {
    var songName = $('.song-name'),
        artistName = $('.artist-name'),
        mobileArtistSong = $('artist-song-mobile');

    songName.text(currentSongFromAlbum.title);
    artistName.text(currentAlbum.artist);
    mobileArtistSong.text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
};

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);

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