# trash
TERA Proxy module to discard undesired items from your inventory

## Usage
Edit **config.json** to set auto-discard default and list items you want trashed.

[Tera Item Database](http://teradatabase.net/us/search/) is a good place to look for item IDs.

### Commands
* **trash**: discards all trash in inventory, aka manual garbage-collect instead of automatic 
* **trash auto**: toggle auto-discard 
* **trash list**: prints out all items in trash list
* **trash help**: prints out list of commands and their description

## To-Do
Need to do a lot of testing in-game to make sure everything works.

Manual trash command seems iffy. 

Doesn't discard existing trash in your inventory until you pick up some trash.

Eventually want to include add/remove functionality to save to config.json

## Credits
Referenced Pinkie's Rootbeer module for inventory parsing and item deletion. 
