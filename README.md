# OtherVids

This is a simple Chrome extension that re-enables the old "other videos from this channel" feature from YouTube past.
When watching a video, you can toggle a shelf (thumbnail slider) of other videos by that channel or user. You can see previews for them and click them to watch the video, as one would expect.

Boilerplate generated via extensionizr.com. Thanks!

##Todo:
- Show which videos were previously watched (like the actual feature used to do).
    - Would require auth, which I really don't feel like doing.
- Fix the css for the watch later and time indicators so that they can work like any other thumbnail.
- Possibly move the API call to v3, if v2 is in danger of being removed.
- Only updates on page load, not video load, so when watching a playlist from multiple channels (i.e. Watch Later), the drop down only shows recent videos from the first channel.
    - Could add a manual refresh button (not user friendly).
    - Could find and attach to the event that YouTube calls when changing videos (+1)
- Possibly make the "OtherVids" text not as obtrusive or something. I keep thinking it's a channel name.
- Take screenshots for Webstore listing.
- ~~Design a not-terrible icon.~~