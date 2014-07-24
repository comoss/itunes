var app = angular.module('itunes');

app.controller('mainCtrl', function($scope, itunesService){
  //This is setting up the default behavior of our ng-grid. The important thing to note is
  //the 'data' property. The value is 'songData'. That means ng-grid is looking for songData on 
  //$scope and is putting whatever songData is into the grid.
  //this means when you make your iTunes request, you'll need to get back the information, 
  //parse it accordingly, then set it to songData on the scope -> $scope.songData = ...
  



  $scope.gridOptions = { 
      data: 'songData',
      height: '110px',
      sortInfo: {fields: ['Song', 'Artist', 'Collection', 'Type'], directions: ['asc']},
      columnDefs: [
        {field: 'Play', displayName: 'Play', width: '40px', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}"><img src="http://www.icty.org/x/image/Miscellaneous/play_icon30x30.png"></a></div>'},
        {field: 'Artist', displayName: 'Artist'},
        {field: 'Collection', displayName: 'Collection'},
        {field: 'AlbumArt', displayName: 'Album Art', width: '110px', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><img src="{{row.getProperty(col.field)}}"></div>'},
        {field: 'Type', displayName: 'Type'},
        {field: 'CollectionPrice', displayName: 'Collection Price'},
        {field:  'Explicit', displayName: 'Explicit Y/N'},
      ]
  };

  //Our controller is what's going to connect our 'heavy lifting' itunesService with 
  //our view (index.html) so our user can see the results they get back from itunes.

  //First inject itunesService into your controller.

    $scope.getResults = itunesService.getArtists;


  //Now write a function that will call the method on the itunesService that is responsible 
  //for getting the data from iTunes, whenever the user clicks the submit button
  //*remember, that method should be expecting an artist name. The artist name is coming from 
  //the input box on index.html, head over there and check if that input box is tied to any 
  //specific model we could use.
  //Also note that that method should be retuning a promise, so you could use .then in this function.
  $scope.getSongData = function(artist) {
    $scope.getResults(artist).then(function(results) {
    console.log(results.data.results);
    var theArray = $scope.createArray(results.data.results);
    console.log(theArray);
    $scope.songData = theArray;
  });
  }

  $scope.createArray = function(results) {
    return results.map(function(song) {
      return {
        Play: song.previewUrl,
        Artist: song.artistName,
        Collection: song.collectionName,
        AlbumArt: song.artworkUrl100,
        Type: song.wrapperType, 
        CollectionPrice: song.collectionPrice,
        Explicit: song.trackExplicitness
      }
    });
  }



  //Once you have that final data array, you simply need to put it on the scope 
  //(or more specifically on the scope as songData). Once you do this ($scope.songData = myFinalArray)
  // then ng-grid will see that and populate the page.
  
});
