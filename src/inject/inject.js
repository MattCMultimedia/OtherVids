chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        var containerTemplate =
                '<div class="othervids-container">'+
                    '<div class="othervids-header">'+
                        'OtherVids'+
                    '</div>'+
                    '<div class="othervids-content">'+
                    '</div>'+
                '</div>';

        var slider = _.template(
                '<div class="feed-item-dismissable post-item">'+
                    '<div class="feed-item-main">'+
                        '<div class="feed-item-header">'+
                             '<span class="feed-item-actions-line">Recent videos from <span class="feed-item-owner"><a href="<%= feed.link[1].href %>" class="yt-user-name"><%= feed.author[0].name.$t %></a></span></span>'+
                        '</div>'+
                        '<div class="feed-item-main-content">'+
                            '<div class="shelf-wrapper clearfix">'+
                                '<div class="compact-shelf shelf-item yt-uix-shelfslider feeds-mode">'+
                                    '<div class="yt-uix-shelfslider-body context-data-container">'+
                                        '<ul id="othervids-list" class="yt-uix-shelfslider-list">'+
                                        '</ul>'+
                                    '</div>'+
                                    '<button class="yt-uix-shelfslider-prev yt-uix-button yt-uix-button-shelf-slider-pager yt-uix-button-size-default" type="button" id="othervids-prev">'+
                                        '<span class="yt-uix-button-content"><img class="yt-uix-shelfslider-prev-arrow" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" alt="Previous" /></span>'+
                                    '</button>'+
                                    '<button class="yt-uix-shelfslider-next yt-uix-button yt-uix-button-shelf-slider-pager yt-uix-button-size-default" type="button">'+
                                        '<span class="yt-uix-button-content"><img class="yt-uix-shelfslider-next-arrow" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" alt="Next" /></span>'+
                                    '</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );


        var itemTemplate = _.template(
                            '<li class="channels-content-item yt-shelf-grid-item yt-uix-shelfslider-item ">'+
                                '<div class="yt-lockup clearfix  yt-lockup-video yt-lockup-grid context-data-item">'+
                                    '<div class="yt-lockup-thumbnail">'+
                                         '<a href="<%= link[0].href %>" class="ux-thumb-wrap yt-uix-sessionlink yt-uix-contextlink yt-fluid-thumb-link contains-addto">'+
                                            '<span class="video-thumb  yt-thumb yt-thumb-175 yt-thumb-fluid"> <span class="yt-thumb-default">'+
                                            '<span class="yt-thumb-clip">'+
                                            '<img src="<%= media$group.media$thumbnail[0].url %>" alt="Thumbnail" width="175" />'+
                                            '<span class="vertical-align"></span></span></span></span></a>'+
                                    '</div>'+
                                    '<div class="yt-lockup-content">'+
                                        '<h3 class="yt-lockup-title">'+
                                             '<a class="yt-uix-sessionlink" title="<%= title.t %>" href="<%= link[0].href %>"><span class="yt-ui-ellipsis-wrapper"><%= title.t %></span></a>'+
                                        '</h3>'+
                                        '<div class="yt-lockup-meta">'+
                                            '<ul class="yt-lockup-meta-info">'+
                                                '<li>'+
                                                    'by <a href="<%= channelHref %>" class="g-hovercard yt-uix-sessionlink yt-user-name "><%= author[0].name.$t %></a>'+
                                                '</li>'+
                                                '<li>'+
                                                    '<%= viewString %>'+
                                                '</li>'+
                                            '</ul>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</li>');


    // LOAD LATEST VIDEOS HERE
    var channelID = $("#watch7-content .yt-user-name").first().data("ytid");
    var vidCount;
    var totalWidth;
    var totalPages;
    var currentPage = 0;
    var pageOffset = 175*5.22;


        $.ajax({
            method: "GET",
            dataType: "JSON",
            data: {
                orderby: "published",
                alt: "json",
                results: 30
            },
            url: "http://gdata.youtube.com/feeds/api/users/" + channelID + "/uploads",
            success: function(data) {
                vidCount = 23;
                totalWidth = vidCount * 175;
                totalPages = Math.floor(vidCount/5);

                $(containerTemplate).insertBefore("#playlist");
                $(".othervids-content").html(slider(data));
                vidCount = data.feed.entry.length;

                _.each(data.feed.entry, function(e) {
                    e.channelHref = data.feed.link[1].href;
                    e.title.t = e.title.$t.slice(0, 60) + "...";
                    e.viewString = e.yt$statistics !== undefined && e.yt$statistics.viewCount !== undefined ? numberWithCommas(e.yt$statistics.viewCount) + " views" : "";
                    $("#othervids-list").append(itemTemplate(e));
                });





                $(".othervids-header").on("click", function() {
                    // expand the othervids-content div
                    var contentDiv = $(".othervids-content").first();
                    if (contentDiv.hasClass("expanded")) {
                        // collapse
                        contentDiv.removeClass("expanded");
                        contentDiv.animate({height: "0", opacity: "0"}, 400);
                    } else {
                        contentDiv.addClass("expanded");
                        contentDiv.animate({height: "210px", opacity: "1"}, 400);
                    }
                });

                $(".yt-uix-shelfslider-next").on('click', function(e) {
                    e.preventDefault();
                    // if we're at the last page, wrap around to the beginning
                    if (currentPage == totalPages) {
                        $("#othervids-list").animate({marginLeft: "0"});
                        currentPage = 0;
                        $("#othervids-prev").css("visibility", "hidden");
                        $("#othervids-prev").css("opacity", "0");
                    } else {
                        currentPage += 1;
                        $("#othervids-list").animate({marginLeft: "-" + (currentPage*pageOffset) + "px"});
                        if (currentPage !== 0) {
                            // hide button
                            $("#othervids-prev").css("visibility", "visible");
                            $("#othervids-prev").css("opacity", "1");
                        }
                    }

                });

                $(".yt-uix-shelfslider-prev").on('click', function(e) {
                    e.preventDefault();
                    if (currentPage === 0) {
                        // beginning page, this button shouldn't have even been clicked cause it should be hidden, but whatever
                    } else {
                        currentPage -= 1;
                        $("#othervids-list").animate({marginLeft: "-" + (currentPage*pageOffset) + "px"});
                        if (currentPage === 0) {
                            // hide button
                            $("#othervids-prev").css("visibility", "hidden");
                        }
                    }
                });







            }
        });
	}
	}, 10);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

});