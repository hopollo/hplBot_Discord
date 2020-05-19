[![Build Status](https://travis-ci.org/hopollo/hplBot_Discord.svg?branch=master)](https://travis-ci.org/hopollo/hplBot_Discord)

**What is HplBot ?**  
Hplbot is currently a dedicated discord bot made to learn/improve HoPollo's Javascript knowledge, this project is also completly remade in TypeScript because i always wanted to know it.  

**HplBot Advantages ?**  
- Fetch your current twitch commands to use it 1to1 on your discord  
- Allow users to create temporary voice channels, delete them when they are empty  
- New temporary channels comes with an invite link posted on the Invite text channel, the creator is also moved inside of it if possible  
- Everybody can improve it. It's made with popular technologies" to seduce as much as possible experienced devs to provide solid pull requests, also i'm always taking feedbacks (tweeter mainly)  

**TODOS & IMPLEMENTS**
[X] Modularise everything    
[X] Finish logs  
[ ] Dedicated lang file with all phrases instead of JSON  

[X] Allow multi discords gestions  
[...] Create website interface 
  [ ] Remake client using React instead of EJS
  [...] Discord auth  
    [ ] Reconnect workflow  
      [ ] Save tokens  
      [...] Auth middleware to routes  
    [X] Get user info  
    [X] Get user guilds  
      [X] Filter only guild using hplBot  
    [ ] Commands interactions  
      [ ] POST commands  
      [ ] PATCH commands  
      [ ] DELETE commands  
    [ ] Config interactions  
      [ ] PATCH config  
[...] Add bot default commands  
  [X] !addcom CMD RESPONSE  
  [X] !delcom CMD  
  [X] !editcom CMD RESPONSE_EDITED  
  [X] !ban USER TIME REASON  
  [X] !kick USER REASON  
  [X] !mute USER REASON  
  [X] !unmute USER REASON  
  [X] !eject USER REASON  
  [x] !purge NUMBER  
  [x] !bancom CMD  
[X] Scrapping commands feature  
  [X] Express current scrapping state with emoji reactions  
    [X] Fail/timeout state  
    [X] Success state    
  [X] Add scrapping from streamElements  
  [ ] Add scrapping from streamLabs  
  [X] Add scrapping from Nightbot  
  [X] Add scrapping from Moobot  
  [ ] Add scrapping from Wizebot  
  [X] Add scrapping from Fossabot  
  [ ] Add scrapping from Kikettebot

[X] Rewrite everything in TypeScript  