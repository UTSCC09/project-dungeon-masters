# Campfire

## Project URL

[campfirestory.me](campfirestory.me)

*Note: The site works fine on Firefox, but not on Google Chrome*

## Project Video URL 

[https://youtu.be/nY1_1eiRgig](video demo) 

## Project Description

The purpose of this web app is to create an immersive storytelling experience by generating a realistic VR scenario with autoplayed soundeffects. A user can create a lobby as a narrator and invite other users as audiences.

In a lobby, the narrator would upload a series of background images to set up the scenes. The narrator would tell the story on a voice chat, while sound effects will be auto played based on the narrators live speech. Specifically, the application would utilize natural language processing to determine entities (i.e rain, thunder, swords) in the narrator's speech to trigger associated sound effects. This process would occur live, with the sound effects being triggered almost instantaneously to ensure an enveloping listening experience. While listening to the narrator and hearing the sound effects, the user would view a track of 360 scenes to engage the user's visual senses.

*Note: The autoplayed sounds are currently limited to the sounds stored in the database. Here's a list of keywords that will trigger a sound effect:*

- cannon
- forest
- rain
- sword
- thunder

## Development

The app is built using React on the front-end, with Tailwind CSS for the UI, and TypeScript along with the following libraries:
- React Three Fibre
- Simple-Peer
- DnDContext
- Howl.js


The backend is built using Node.js, Express, Graphql, MongoDB and the following libraries:
- Google Natural Language ML
- Google Speech to Text
- Socket.io


## Deployment

We used a VM on Amazon Web Services as the host. We went onto Namecheap to obtain a domain name and an ssl certificate for our nginx reverse proxy. Our application is dockerized into frontend and backend containers, and uses nginx to serve the static files and as a reverse proxy. The frontend is secured by Cloudflare.

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

N/A

## Challenges

1. Deployment was difficult due to determining which approach we would take, configuring ssl and reverse-proxy to work with web sockets.
2. WebRTC was difficult due to the learning curve and finding the correct resources to match our specific needs.
3. Optimizaing sfx playback in combination with Speech to text and natural langauge processing.

## Contributions

Artina Sin: 
- Created the frontend form to add a campfire
- Setup image uploads and retrieving images
- Setup webRTC and websockets to allow voice call in a campfire lobby
- Setup and resolving issues related to deployment

Wilson Mak: 
- Setup backend using Graphql and Mongoose
- Add API calls for backend
- Setup general Authentication
- Setup SFX player on frontend
- Used websockets to recieve narrators speech on backend, and utilized google speech to text to and google natural langauge to determine sfx to play
- Used websockets to broadcast sfx to all listeners

Yiyang Zhou: 

# One more thing


Thank you for creating the extra labs, they were helpful.
