# Telegram Address Finder Bot

**Address Finder Bot** helps find the address on the map if you ever are curious to do so. Simply type an address in the bot chat
```
400 EDWARDS LN VANCOUVER
```
And you will get the pin on the map and full location name taken from Google Maps.

If you register in the bot
```
/register Kyiv, Dmytra Lutsenka Street
```
your location will be saved, and you can be notified if address of your interest is within your threshold(default `500 meters`). Also, you can register simply by messaging your current location to bot by location function in the telegram.

### Commands:
- `/start` - invitation message
- `/register` - register your address
- `/threshold` - adjust threshold to be notified if you're close enough
- `/user` - current user settings

### To set up bot you need to:
1. Create your bot in the @BotFather. Find it in the telegram and follow the prompts to create your own bot. You need to take generate a token for your bot and save it to `BOT_TOKEN` in the `.env` file.
2. Setup [Google Map API](https://developers.google.com/maps/documentation/geocoding/cloud-setup). You need to store an API key into the `GOOGLE_MAPS_TOKEN` in the `.env` file.
3. Install [ngrok](https://ngrok.com/) for web hook setup.
    ```
    npm install ngrok -g
    ```
4. Set `EXPRESS_PORT` to the desired value whichever you have available(e.g. 3000).
5. Establish the session with selected port for [expressjs](https://expressjs.com/en/starter/installing.html)
    ```
    ngrok http 3000
    ```
    Take HTTPS url from the forwarding (e.g. `https://000-00-000-00-00.ngrok.io`) and set it to `APPLICATION_URL` variable 
6. `npm install`
7. `npm start`

And that's it! Thank you for your time!
