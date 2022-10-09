ui.notification.show("Press shift and your brakes key to fire guns.")
setTimeout(() => {
ui.notification.show("You must be within a certain range and altitude of an enemy player to shoot them down or get shot down.")
},3000)
geofs.debug.shiftIsTrue = 0
document.addEventListener("keydown", function(e) {
   if (e.keyCode == 16 || e.keyCode == 13) {
geofs.debug.shiftIsTrue = 1
	}
	document.addEventListener("keyup", function(e) {
if (e.keyCode == 16 || e.keyCode == 13) {
   geofs.debug.shiftIsTrue = 0
}
	})
})
//Add a Huey with guns (as an option)
geofs.animation.values.gunsOn = null;
function gunSound() {
if (geofs.animation.values.brakes == 1 && geofs.debug.shiftIsTrue == 1) {
   if (geofs.aircraft.instance.id == 7 || geofs.aircraft.instance.id == 18 || geofs.aircraft.instance.id == 15 || geofs.aircraft.instance.id == 2581 || geofs.aircraft.instance.id == 2808 || geofs.aircraft.instance.id == 3591 || geofs.aircraft.instance.id == 4172 || geofs.aircraft.instance.id == 3617 || geofs.aircraft.instance.id == 4251) {
	geofs.animation.values.gunsOn = 1
   audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mirage-2000_sounds_m-2000-guns.wav")
}
//this is the special one...
   if (geofs.aircraft.instance.id == 2310) {
geofs.animation.values.gunsOn = 1
audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/brrrt.mp3")
}
	} else {
geofs.animation.values.gunsOn = 0
	}
};
gunSoundInt = setInterval(function(){gunSound()},1000)

//define functions
function crashAircraft() {
   geofs.aircraft.instance.engines.forEach(function(e){
e.maxRPM = 1
	})
   new geofs.fx.ParticleEmitter({ anchor: { worldPosition: [0, 0, 0] }, duration: 1e3, rate: 0.01, life: 1e4, near: 10, startScale: 0.05, endScale: 1, startOpacity: 0.5, endOpacity: 1e-4, texture: "darkSmoke" });
	audio.playShutdown();
};
function radians(n) {
  return n * (Math.PI / 180);
};
function degrees(n) {
  return n * (180 / Math.PI);
};
function getBearing(a, b, c, d) {
  startLat = radians(c);
  startLong = radians(d);
  endLat = radians(a);
  endLong = radians(b); 
  let dLong = endLong - startLong; 
  let dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0)); 
  if (Math.abs(dLong) > Math.PI) { 
    if (dLong > 0.0) 
	   dLong = -(2.0 * Math.PI - dLong); 
    else 
	   dLong = (2.0 * Math.PI + dLong); 
  } 
  return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
};
//main function
/*Value list of Object.values(multiplayer.users)[0]
e.callsign
e.aircraft (returns id)
e.distance
e.referencePoint.lla[0] and [1] for lla
e.referencePoint.lla[2] and geofs.aircraft.instance.llaLocation[2] for altitude in meters
*/
// map.updatePlayerMarker
//line 21000 for multiplayer update bullshit
//setInterval(function(){Object.values(multiplayer.users)[0].lastUpdate.cookie + ", " + Object.values(multiplayer.users)[0].lastUpdate.acid + ", " + Object.values(multiplayer.users)[0].lastUpdate.sid + ", " + Object.values(multiplayer.users)[0].lastUpdate.id + ", " + Object.values(multiplayer.users)[0].lastUpdate.ac + ", " + Object.values(multiplayer.users)[0].lastUpdate.co + ", " + Object.values(multiplayer.users)[0].lastUpdate.ve + ", " + Object.values(multiplayer.users)[0].lastUpdate.st.as + ", " + Object.values(multiplayer.users)[0].lastUpdate.m + ", " + Object.values(multiplayer.users)[0].lastUpdate.ci},1000)

var airToAirOn = new Boolean(0)
var shotDownUser = null
var shootdownNotification = new Boolean(0);
function checkAim() {
   Object.values(multiplayer.visibleUsers).forEach(function(e){
//If the two users are at the same altitude and within gun range (I don't want to do triginometric interpolation)
	if (e.referencePoint.lla[2] - geofs.aircraft.instance.llaLocation[2] <= 50 && geofs.aircraft.instance.llaLocation[2] - e.referencePoint.lla[2] <= 50 && e.distance <= 1000 && e.lastUpdate.st.as > 50) {
//If you're pointed at them and shooting your gun, shoot them down
if ((geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) <= 5 && (geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) >= -5 && geofs.animation.values.gunsOn == 1) { //place smoke emitter on "enemy" player
	 if (shootdownNotification == 0) {
	    ui.notification.show("You shot down " + e.callsign)
		 shootdownNotification = 1
		 //This just makes sure that ui.notifications don't clog up on top of each other.
		 setTimeout(() => {shootdownNotification = 0},5000)
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
	if (getBearing(lastLLA[0], lastLLA[1], e.referencePoint.lla[0], e.referencePoint.lla[1]) + geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]) <= 5 && getBearing(lastLLA[0], lastLLA[1], e.referencePoint.lla[0], e.referencePoint.lla[1]) - geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]) >= -5 && e.id != shotDownUser) {
	if (shootdownNotification == 0) {
shootdownNotification = 1
crashAircraft()
audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
ui.notification.show("You were shot down by " + e.callsign)
console.log("shootdown")
setTimeout(() => {shootdownNotification = 0},5000)
   }
	}
},1000)
}
   }
	})
};
goInt = setInterval(function(){checkAim()},100);
