const config = require('./config')
const Command = require('command')


module.exports = function GarbageCollect(dispatch) {
	const command = Command(dispatch)

	let gameId = null,
		myLocation = null,
		inventory = [],
		autotrash = config.auto,
		trashlist = config.trash

	command.add('trash', (arg0, arg1) => {
		let msg = null

		switch(arg0){
			default: // instantly discard all trash from inventory NOW
					garbageCollect() 
					msg = 'All trash discarded' // TO-DO: more testing of this
				break
			
			case 'auto': // toggles auto-discarding of items
					autotrash = !autotrash
					if(autotrash) garbageCollect()
					msg = 'Auto-discard ' + (autotrash ? 'enabled' : 'disabled')
				break
			
			case 'list': // prints out a list of all items in trash list
					msg = 'Items in trash list: ' + trashlist.toString()
				break
			
			case 'help': // shows list of commands and their description
					msg = 'List of commands: \n\t'
						+ "trash \t\t\t- discard all trash from inventory \n\t"
						+ "trash auto \t\t\t- toggle auto-discard \n\t"
						+ "trash help \t\t\t- list available commands \n\t"
						//+ "trash add [id] \t\t- add item to trash list (TO-DO)\n\t"
						//+ "trash remove [id] \t- remove item from trash list (TO-DO)\n\t"
						
				break

			// case 'add':
			// 		if(!isNaN(arg1)){
			// 			trashlist.concat(arg1)
			// 			garbageCollect()
			// 			msg = 'Added item ' + arg1 + ' to trash list'
			// 		}
			// 	break
			
			// case 'remove':
			// 		if(!isNaN(arg1)){
			// 			trashlist.remove(arg1)
			// 			msg = 'Removed item ' + arg1 + ' from trash list'
			// 		}
			// 	break
		}
		command.message('(Garbage-Collector) ' + msg)
	})

	dispatch.hook('S_LOGIN', 9, event => { ({gameId} = event) })
	dispatch.hook('S_SPAWN_ME', 2, event => { myLocation = event })
	dispatch.hook('C_PLAYER_LOCATION', 3, event => { myLocation = event })

	dispatch.hook('C_SHOW_INVEN', 1, event => {if(autotrash) garbageCollect()}) // discards trash when you open your inventory, TO-DO: more testing
		
	dispatch.hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, event => {
			if(autotrash && trashlist.includes(event.item)) // only garbage collects once you pick up some trash
				garbageCollect()
		})

	function deleteItem(slot, amount) { // credits to Pinkie's Rootbeer module
		dispatch.toServer('C_DEL_ITEM', 2, {
			gameId,
			slot: slot - 40,
			amount
		})
	}

	function garbageCollect() {
		let invenHook = dispatch.hook('S_INVEN', 12, event => {
			inventory = inventory.concat(event.items)

			if(!event.more) {
				for(let item of inventory){
					if(item.slot < 40) continue // first 40 slots reserved for gear, etc.
					else if(trashlist.includes(item.id))
						deleteItem(item.slot, item.amount)
				}
			}
			inventory = []
			dispatch.unhook(invenHook) // Unhook after we've cleaned up
		})
	}
}