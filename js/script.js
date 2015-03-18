
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var myNYTimesAPIKey = 'b77b763a8e287f9434b689f3c43b058d:3:71384006';

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var city = $('#city').val();
    if ( city.indexOf(" ") > 0 ) {
        var cityArr = city.split(" ");
        for(var i=0; i<cityArr.length; i++){
            cityArr[i] = cityArr[i].substring(0,1).toUpperCase()  + cityArr[i].slice(1);
        }
        city = cityArr.join(" ");
    }
    else {
        city = city.substring(0,1).toUpperCase()  + city.slice(1);
    }
    
    $('#greeting').text('So you want to live at ' + $('#street').val() + ', ' + $('#city').val() + '?');
    $('#nytimes-header').text('New York Times Articles About ' + city );

    var newImgLocationURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&';
    newImgLocationURL += 'location=' + $('#street').val() + ',' + $('#city').val();
    $body.append('<img class="bgimg" src="' + newImgLocationURL + '">');

//1803 Ocean Avenue, Belmar
//1240 Duck Road, Duck, NC 27949
//3600 S Las Vegas Blvd, Las Vegas,
//Golden Gate Bridge, San Francisco
    
    //Call NYTimes Article Search API
    //Query.getJSON( url [, data ] [, success ] )
    var NYTimesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json'; //?q=golden+gate+bridge&begin_date=20150101&end_date=20150215&api-key=sample-key';
    //var QueryString ?q=golden+gate+bridge&begin_date=20150101&end_date=20150215&api-key=sample-key';
    
    var queryString = {
       q: $('#city').val(),
       sort: 'newest',
       'api-key': myNYTimesAPIKey
    }
    $.getJSON(NYTimesURL, queryString)
    .done(function( data, status ) {
        console.log("NY Times Result: " + status);
        var items = [];
        $.each( data.response.docs, function( i, item ) {
            var title = item.headline.main;
            var url = item.web_url;
            var summary = item.snippet;
            var aLink = "<a href='" + url + "'>" + title + "</a>";
            var pText = "<p>" + summary + "</p>";
            items.push( "<li class='article'>" + aLink + pText + "</li>" );
            console.log("\t" + item.headline.main);    //"<li id='" + item.headline + "'>" + val + "</li>" );
        });
        $('#nytimes-articles').append(items.join( "" ));
     })
     
     .fail(function( jqxhr, textStatus, error ) {
        console.log( "error" );
        $('#nytimes-header').text('New York Times Articles Could Not Be Loaded');
     })
     .always(function() { 
        console.log('getJSON request to NY Times ended'); 
     });

  
var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text("failed to get wikipedia resources");
}, 8000); //Issue this statement after 8 seconds

$.ajax({
    url: 'http://en.wikipedia.org/w/api.php', 
    data: {
        action: 'opensearch',
        format: 'json',
        redirects: 'resolve',
        search: city
    },
    dataType: 'jsonp',
    jsoncallback: 'myCallBack',

    success: function( jsondata ) {
        console.log("Wiki Result success: ");
        //SAMPLE-->  Object {0: "San Francisco", 1: Array[10], 2: Array[10], 3: Array[10], warnings: Object}
        var items = [];
        var resultCnt = jsondata[1].length;
        for (x=0; x < resultCnt; x++){
            var title = jsondata[1][x];
            console.log("\t" + title);
            var url = jsondata[3][x];
            var summary = jsondata[2][x];
            
            var aLink = "<a href='" + url + "'>" + title + "</a>";
            var pText = "<p>" + summary + "</p>";
            items.push( "<li class='article'>" + aLink + pText + "</li>" );
        }    
        $('#wikipedia-links').append(items.join( "" ));

        //Turn off the setTimeout timer, the request was successful
        clearTimeout(wikiRequestTimeout);

        console.log('ajax request to Wikipedia ended'); 
    }
});  


    return false;
};

$('#form-container').submit(loadData);

//loadData();


//http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&q=Todd+Gurley&begin_date=20140901&end_date=20150215&api-key=sample-key
//callback svc_search_v2_articlesearch
/*
X-Mashery-Responder: prod-j-worker-atl-04.mashery.com
Server: nginx/1.4.1
Date: Thu, 19 Feb 2015 17:10:57 GMT
Content-Type: application/json; charset=UTF-8
Content-Length: 16491
Vary: Accept-Encoding
X-Powered-By: PHP/5.3.27
X-Cached: MISS
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
*/


