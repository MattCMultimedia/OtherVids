chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        var containerTemplate = '<div class="othervids-container">'+
            '<div class="othervids-header">'+
            'OtherVids'+
            '<div id="othervids-indicator" class="othervids-can-expand"></div>'+
            '</div>'+
            '<div class="othervids-content">'+
            '</div>'+
            '</div>';

        $(containerTemplate).insertBefore("#playlist");

	}
	}, 10);
});