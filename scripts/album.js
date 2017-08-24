// Variables
var albumArt = document.getElementById('albumCover'),
    currentAlbum = null,
    currentlyPlayingSongNumber = null,
    currentSongFromAlbum = null,
    currentSoundFile = null,
    currentVolume = 50,
    $previousButton = $('.main-controls .previous'),
    $playPauseButton = $('.main-controls .play-pause'),
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
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>';
 
     var $row = $(template);

     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        var $seekBar = $('.volume .seek-bar');

        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Play to Pause 
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            updateSeekPercentage($seekBar, currentVolume/100);
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Pause to Play
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                setSong(songNumber);
                currentSoundFile.play(); 
                updateSeekBarWhileSongPlays();   
            } else {
                $(this).html(playButtonTemplate);
                currentSoundFile.pause();
            };
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

function setCurrentTimeInPlayerBar(currentTime) {
    return $('.current-time').text(currentTime);
};

function setTotalTimeInPlayerBar(totalTime) {
    return $('.total-time').text(totalTime);
};

function filterTimeCode(timeInSeconds) {
    var timeInSeconds = parseInt(timeInSeconds),
        seconds,
        minutes;

    minutes = Math.floor(timeInSeconds / 60);
    seconds = Math.floor(timeInSeconds % 60);


    return minutes + ':' + ("00" + seconds).substr(-2);
};

function seek(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
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

function setupSeekBars() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #3
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;
        
        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
        

        if ($(this).parent().hasClass('volume') !== true) {
            seek(seekBarFillRatio * currentSongFromAlbum.duration);
        } else {
            setVolume(seekBarFillRatio * 100);
        };
    });

    $seekBars.find('.thumb').mousedown(function(event) {
        // #8
        var $seekBar = $(this).parent();

        // #9
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            updateSeekPercentage($seekBar, seekBarFillRatio);

            if ($seekBar.parent().hasClass('volume') !== true) {
                seek(seekBarFillRatio * currentSongFromAlbum.duration);
            } else {
                setVolume(seekBarFillRatio * 100);
            };
        });

        // #10
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

function updateSeekBarWhileSongPlays() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
        });
    }
};

function updateSeekPercentage($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
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
    updateSeekBarWhileSongPlays();

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
    updateSeekBarWhileSongPlays();

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

    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

function togglePlayFromPlayerBar() {

    if (currentSoundFile.isPaused()) {
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();    
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    } else {
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
    };
}

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);


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