# Camp Fire
# Team Members
| Name        | Student Number | UTORID   |
|-------------|----------------|----------|
| Artina Sin  | 1004909904     | siniat   |
| Wilson Mak  | 1004869403     | makwils2 |
| Yiyang Zhou | 1005719386     | zhouyiy8 |
# A Description of the Web Application
The purpose of this web app is to create an immersive storytelling experience by generating a realistic VR scenario with autoplayed soundtracks. A user can create a lobby as a narrator and invite other users as audiences.

In a lobby, the narrator would upload a series of background images to set up the scenes. The narrator would tell the story on a voice chat, while soundtracks/sound effects will be auto played based on the live speech. Specifically, the application would utilize natural language processing to determine entities (i.e rain, thunder, swords) in the narrator's speech to trigger associated sound effects. This process would occur live, with the sound effects being triggered almost instantaneously to ensure an enveloping listening experience. While listening to the narrator and hearing the sound effects, the user would view a track of 360 scenes to engage the user's visual senses. 
# Key features that will be completed by the Beta version
1. Create screenplay script by lining up multiple images.
2. Turn images into 360 VR scenes.
3. Live voice chat. 
4. Live speech to text.
5. Basic account and lobby management functionality.
# Additional features that will be complete by the Final version
1. Overlay of a transcription of the story on top of the VR environment.
2. Using natural language processing to play sound effects.
3. Upload or browse background music to compliment the screenplay script.
# Technology stack that we will use to build and deploy it
For the frontend, we will be using **React**, **Tailwind CSS** and **TypeScript**.
For the backend we will be using **Express.js**, **MongoDB** and **GraphQL** for data exchange. 
We will deploy and host our application with **AWS**.
To keep track of the features that we need to implement, we will be using **Jira**.

We will also utilize the following libraries/APIs:
- [Google speech to text](https://cloud.google.com/speech-to-text?utm_source=google&utm_medium=cpc&utm_campaign=na-CA-all-en-dr-bkws-all-all-trial-p-dr-1011347&utm_content=text-ad-none-any-DEV_c-CRE_553163282119-ADGP_Desk%20%7C%20BKWS%20-%20PHR%20%7C%20Txt%20~%20AI%20%26%20ML%20~%20Speech-to-Text_Speech%20to%20Text_General-KWID_43700066945310816-kwd-307155559603&utm_term=KW_google%20speech-ST_google%20speech&gclid=CjwKCAiAsYyRBhACEiwAkJFKos802bLXiU0rf-73UiKOpsAcb-rbhud2Fb4k_VUcMUs1w8YeZyHIIRoCX8EQAvD_BwE&gclsrc=aw.ds)
- [Google cloud natural language](https://cloud.google.com/natural-language?utm_source=google&utm_medium=cpc&utm_campaign=na-CA-all-en-dr-skws-all-all-trial-p-dr-1011347&utm_content=text-ad-none-any-DEV_c-CRE_532162994877-ADGP_Desk%20%7C%20SKWS%20-%20PHR%20%7C%20Txt%20~%20Cloud%20Natural%20Language-KWID_43700064911459760-kwd-912789485721&utm_term=KW_natural%20language-ST_Natural%20language&gclid=CjwKCAiAsYyRBhACEiwAkJFKojTT0tTGSQP7FXm55CvI3Pb85DtZDs8THteQrT56SGH1eSFLNLT0DhoCC_QQAvD_BwE&gclsrc=aw.ds)
- [React 360](https://www.npmjs.com/package/react-360)
- [freesound API](https://freesound.org/docs/api/)
 
# Top 5 technical challenges
1. We need to find a way to utilize the result returned by the natural language processor to play the suitable soundtrack.
2. How to naturally blend soundtracks with each other when switching without sounding interrupted.
3. We need to figure out how to limit the sound effect to only be triggered by the narrator, and ensure the sound effect is played on every user’s side.
4. How to generate a VR scene using normal 2D images.
5. How to optimize the responsiveness of the whole process of speech to text, natural language process and playing soundtrack to provide an enjoyable user experience.
