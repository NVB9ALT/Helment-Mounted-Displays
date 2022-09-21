   Object.values(multiplayer.visibleUsers).forEach(function(e){
//If the two users are at the same altitude and within gun range (I don't want to do triginometric interpolation)
	if (e.referencePoint.lla[2] - geofs.aircraft.instance.llaLocation[2] <= 250 && geofs.aircraft.instance.llaLocation[2] - e.referencePoint.lla[2] <= 250 && e.distance <= 1000) {
//If you're pointed at them and shooting your gun, shoot them down
if ((geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) <= 5 && (geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) >= -5 && geofs.animation.values.gunsOn == 1) { //place smoke emitter on "enemy" player
	 if (shootdownNotification == 0) {
	    ui.notification.show("You shot down " + e.callsign)
		 shootdownNotification = 1
		 //This just makes sure that ui.notifications don't clog up on top of each other.
		 setTimeout(() => {shootdownNotification = 0},1000)
	 }
	 shotDownUser = e.id
};
//This is some compelex gobbledygook - let me explain.
//Essentially, it judges an aircraft's heading by checking the bearing between its position 1 second ago and its position now.
//Then, it checks if that heading matches the bearing to that user.
//It essentially checks if the user is doing what the above code statement is checking for.
//Also, it double-checks that this isn't the user that you just shot down.
var lastLLA = [e.referencePoint.lla[0],e.referencePoint.lla[1]]
if (e.aircraft == 7 || e.aircraft == 18 || e.aircraft == 15 || e.aircraft == 2581 || e.aircraft == 2808 || e.aircraft == 3591 || e.aircraft == 4172 || e.aircraft == 3617) {
setTimeout(() => {
	if (getBearing(lastLLA[0], lastLLA[1], e.referencePoint.lla[0], e.referencePoint.lla[1]) + geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]) <= 5 && getBearing(lastLLA[0], lastLLA[1], e.referencePoint.lla[0], e.referencePoint.lla[1]) - geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]) >= 5 && e.id != shotDownUser) {
	if (shootdownNotification == 0) {
shootdownNotification = 1
crashAircraft()
audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
ui.notification.show("You were shot down by " + e.callsign)
console.log("shootdown")
setTimeout(() => {shootdownNotification = 0},1000)
   }
	}
},1000)
}
   }
	})
