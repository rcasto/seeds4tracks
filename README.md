# Seeds4Tracks
Idea is simple:
- You like music
- You check certain places often for new music
- Let's aggegrate these sources

Personally I check the following places for my music recommendations:
- Google Play Music new music playlists
- We are the guard (best new indie)
- Soundcloud stream

Idea would be to design a model through which multiple sources can contribute to the same feed

Would want to enable the ability to remove songs that have already been checked out and were not liked and keep those or archive those songs that were liked

## Starting simple (v1)
Let's just hack together a little app that scrapes We are the guard and gets me the freshe`st music for the week and displays it in a simple ui (**may even just send me an email with the music for this week**)

## Another Idea (v2)
Allow the user to specify a list of their favorite artists
From these "seed artists" go further and find similar or related artists to them

Scan through new album/song releases and find new music that the user may like by these artists if they exist

Spotify has a Web API that can supply this functionality and this technique should not require the user to authenticate at all.

The user could then select to send this list to an email address if they wanted to or a playlist could be created via spotify.
    - The last functionality may require that the user signs in, but upfront the user should be able to find music that they like that is similiar to music that they already like

## Latest Notes (v3)
Currently only utilizing [Spotify Web API](https://beta.developer.spotify.com/documentation/web-api/reference/).

This API contains endpoints that each do parts of the pipeline I would want for this project.
- Enable user to specify artists in English not some arbitrary id (Utilize [search api](https://beta.developer.spotify.com/documentation/web-api/reference/search/search/))
- Generate track recommendations based off of seed or user provided artists (utilize [recommendations api](https://beta.developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/))
    - There are definite limitations to this API, for example can **only submit up to 5 artists** or rather "seeds" that is any combinations of artists, genre's, tracks, whatever
    - Are there ways to filter the recommendations such that they are ordered by release date?  Newer recommendations occur first
    - Is there a way to associate weight with certain recommendations or results?