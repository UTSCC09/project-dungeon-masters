#Genesis - TRPG Session Hosting Application
#Team Members
| Name        | Student Number | UTORID   |
|-------------|----------------|----------|
| Artina Sin  | 1004909904     | siniat   |
| Wilson Mak  | 1004869403     | makwils2 |
| Yiyang Zhou | 1005719386     | zhouyiy8 |

#A Description of the Web Application
##Overview of the Game
Dungeons & Dragons (DnD) is a type of tabletop role-playing game where a player acts as a host (Dungeon Master, or DM) and other players create their own characters (Player Characters, or PC) to go on an adventure in a fantasy world. The game is usually very long and will take several meetings to complete (one full game is usually called a campaign), and the majority of the game play follows the pattern of:
DM describes the situation
PC describes what their character will do
DM decides based on the decided action, the threshold of success (what is the minimum rolled number for the action to be success)
PC rolls the dice
The result of the dice is modified by the character’s skills, ability modifiers, etc. Then the final result is used to decide the outcome of the action
DM describes what happens next and repeats this process
##What the Web Application will Consists of
The goal of the web application is to make managing these sessions easier, whether they are in person or online. A logged-in user would be able to create a room as a DM and invite other players to join as PC. The players are expected to be able to communicate with each other outside the site while playing (either in person or through a voice call).
PC would create their character by filling out a **character creation form** and have the character information stored in the database. The DM then introduce the PCs to the game setting, and would be able to **record the location and event** so that players can keep track of the things that are happening while in the game and when they resume the next session.
When performing a **dice roll**, the DM will select the PC performing the action, specify the dice roll type and success condition, and make a prompt to the PC. On the PC’s side, they will be able to click a “Roll” button or roll a real die to determine whether their action is successful or not. The action and result will be saved in the **history backlog** for players to refer to and the DM will make changes to game status accordingly.
Other game mechanics such as combat, spell cast and leveling up will be done in a similar manner where the application would perform the calculation and DM has the permissions to **update different tokens** based on the outcome.
The DM can pause their room and mark it as complete. All players would be able to **view the backlog** anytime they wish. Once the campaign is complete, the PC can **export their character** to a different campaign.
#Key features that will be completed by the Beta version
The following features will be completed by the Beta version:
**Room / lobby creation and gallery**: this includes creating a lobby, searching a lobby, entering a lobby through a passcode, and saving a lobby to your account
**Character sheet creation**: this includes creating a form for PC to create a new character during a session and viewing the character during the session (editable, see Token tracking) and outside of the session (read only)
**Token tracking**: during the session, DM or PC can edit various fields on their character sheets or spell sheet. 
Basic stats of the PC, such as strength and wisdom. 
Hit points (max, current, and temporary). 
Character level and current exp point. Proficiency choices.
Number of hit dice, or spell slot spent, and successes and failures of death saves.
Info about equipment obtained or spells learned / that are ready.
Other fields that are dependent on one or more of the above fields will be automatically computed and filled in.
**Dice roller**: this includes the DM interface to prompt a dice roll, the PC interface to roll the die, the calculation and displaying the result on a backlog.
The calculation includes Combat dice rolls and Result of decided action dice rolls
Players can also manually enter a value if they prefer to use in-real-life dice but also want to add the result to the backlog.
**Level up**: once the exp reaches a threshold according to the rules, the character sheet gets updated accordingly.
#Additional features that will be complete by the Final version
The following features will be completed by the Final version:
**Documentation, help feature**: by using the [dnd5eapi] (https://www.dnd5eapi.co/), we will create a search feature for data regarding character creation and rules
**History backlog**: aside from displaying results of past dice rolls, allow DM to delete a dice roll that is made by mistake. The history backlog will also include the story telling of the DM (the DM can note down important information to all players or just themselves) and the edit history of the character tokens by the DM, and the DM can revert the changes if need be.
**World building helper**: if time permits, we will create an interface where DMs can make notes and prepare the sessions.
NPC background information, and their stats
Locations names, along with their background information for cities, landmarks, countries etc
Personal quest notes for both the DM and player to input lore/quest details they find interesting or deem important
Organization tracker to describe outline the names and backgrounds of different groups, like religions, guilds, and mercenary groups
**Exporting character**: this includes exporting the character to a different campaign (or giving the selection to PC to reuse a character) and exporting the character using the [dnd character sheet library](https://www.npmjs.com/package/dnd-character-sheets)
#Technology stack that you will use to build and deploy it
For the frontend, we will be using **React**, **Tailwind CSS** and **TypeScript**. For the backend we will be using **Express.js**, **MongoDB** and **GraphQL** for data exchange. We will be using the [dnd5eapi] (https://www.dnd5eapi.co/) and [dnd character sheet library](https://www.npmjs.com/package/dnd-character-sheets) as mentioned above. We will deploy and host out application with **AWS**. To keep track of the features that we need to implement, we will be using **Jira**.
#Top 5 technical challenges
Based on our understanding of the scope and difficulty of the features, these are what we think would be our top 5 technical challenges:
Real-time information exchange. The main feature is to allow the DM to prompt a dice roll and update any character status in real-time. Although we learnt this in class by making a get request at regular time-intervals, this also means a lot of information has to be passed around. We have to either find other ways to do this or make suitable sacrifices on the performance.
Designing the UI in general. DnD itself has a lot of rules and information related to the game play. It will be a challenge to design a clean, consistent layout that does not overload users with information.
Learning the dnd5eapi and using it for the search feature. Creating a search feature that searches keywords from our database will be challenging. We suspect creating a search feature that requires us making good use of this wonderful api would be even more difficult. 
Storing and showing the history backlog. Since the history backlog would store and display dice roll results, story settings, character sheet edit history, etc. that are of different types of information, we will have to think about what is the best way to store and display them in an appropriate order.
Learning new technologies. Some of the technology stack that we are using for the project are new to some members (e.g. Wilson does not know React, Artina and Yiyang are not familiar with TypeScript and none of us knows GraphQL). We will have to spend time learning and getting familiar with the technology we use, so we expect the project setup would be a spike.