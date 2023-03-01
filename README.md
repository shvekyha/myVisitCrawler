# myVisitCrawler
This repo includes a js script that scan the myVisit website in order to find an appointment for renewing an existing expired passport.
In order to run it, you'll need a way to run a custom js in the browser (I'm using [Tempermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)).

>_NOTICE:
For now this is the only purpose of the script, it searches only the **internal office (רשות האוכלוסין וההגירה)**, only for the service of issuing an **Isreali biometric passport**, renewing an existing **expired** one (not first passport, not a stolen one or lost one etc). If you need any other service it can't be done by this specific script (cant be twicked it if you really want)_



>IMPORTANT: Because of CAPTHCA + 2FA the script cannot login for you! A login using your phone is needed, only then you can run the script for automating the search. Also, the script wont book an appointment for you, but rather pop an alert window once an appointment is found. So you'll need to be near the computer and wait for the result, then if a sopt was found and it's suitable for you, you can stop the script and book it manually.

### Using the script
#### Custom the script to your needs
Download the script and change the user data at the top of the screen to your own:

```js
const ID = 'XXXXXXXXX';                   //The ID of the person requesting the appointment
const PHONE_NUMBER = 'XXXXXXXXXX';        //The phone number of the person requesting the appointment

const LOCATION_NUM_TO_CHECK = 20;         //Number of locations to scan
const LOCATION_SKIP_LIST = [];            //List of locations indexes to skip (0-based) - for example [13,20]
const MONTHS_SKIP_LIST = ['Aug','Jul'];   //List of months to skip when looking for an appointment
```

#### Consts explanation
- _ID (mandatory)_ - the ID of the person requesting the appointment
- _PHONE_NUMBER (mandatory)_ - the phone number of the person requesting the appointment
- _LOCATION_NUM_TO_CHECK (mandatory)_ - number of locations to check from the list. Notice that they might be sorted according to the browser location, or by a default sort. In any case, check how far you're whilling to go and enter the number of the furthest one here (default is 20).
- _LOCATION_SKIP_LIST (optional)_ - This is the list of locations to skip if needed. There are locations that are for residants only, so you'd want to skip those and not look there. Make sure to enter their index in the list (0-based), according to your location list. You can also leave it empty if you wish.
- _MONTHS_SKIP_LIST (optional)_ - This is the list of months to skip (in the form of 3-chars string). This means that the script wont stop if it finds an appointment in these months, and will mark this location as having 'no available appointments'. (Because the appointments are sorted from earlier to later, having ['Aug','Jul'] in the list for example, will find spots earlier than July.)

#### Running the script
Place the script in your preffered js tool (if using Tempermonkey, you can use as is, for other tools remove the comments in the beggining). Then follow these steps:
- Go to [myVisit](https://myvisit.com/#!/home/il) website 
- login with 2FA (enter phone number and code from SMS)
- Notice the (really ugly) grey button at the top saying 'Find my spot!'
- If you'd like to monitor the script as it goes, open dev tools on the console tab. 
- Click the button and wait
- If you're using dev tools - you'll see the log writing as it advances and a comment if it **doesn't** find a spot at a location.
- If a spot at a certain location is found it will pop up an alert with the details. You can click OK to stop the script and book the appointment **manually**, or click Cancel to continue the search.

<img alt="Found spot alert" src="https://user-images.githubusercontent.com/7942533/222105494-d29d78ff-3807-4160-b250-4ce2538c93af.png" />

**IMPORTANT: This script is for personal use only! I wrote it out of my own pesonal pain trying to find an appointment, please dont exploit it. A person who will be found as using this for commercial purposes, taking money from people for using it, or using it in any other way not intended by the author, will be reported and prosecuted by law.**

