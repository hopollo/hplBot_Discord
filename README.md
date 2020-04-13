**TODO & Features progess :**   
[X] Modularise everything    
[X] Finish logs  
[ ] Dedicated lang file with all phrases instead of JSON  

[X] Allow multi discords gestions  
[...] Create website interface 
  [...] Discord auth  
    [ ] Reconnect workflow  
      [ ] Save tokens  
      [ ] Auth middleware to routes  
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
  [ ] !purge NUMBER  
  [ ] !bancom CMD  
[...] Scrapping commands feature  
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