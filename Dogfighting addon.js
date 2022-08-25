geofs.animation.values.gunsOn = null;
function gunSound() {
if (geofs.animation.values.groundContact == 0 && geofs.animation.values.brakes == 1) {
   if (geofs.aircraft.instance.id == 7 || geofs.aircraft.instance.id == 18 || geofs.aircraft.instance.id == 15 || geofs.aircraft.instance.id == 2581 || geofs.aircraft.instance.id == 2808 || geofs.aircraft.instance.id == 3591 || geofs.aircraft.instance.id == 4172 || geofs.aircraft.instance.id == 3617) {
	geofs.animation.values.gunsOn = 1
   audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mirage-2000_sounds_m-2000-guns.wav")
}
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
e.thrust = 0
	})
   new geofs.fx.ParticleEmitter({ anchor: { worldPosition: [0, 0, 0] }, duration: 1e3, rate: 0.01, life: 1e4, near: 10, startScale: 0.05, endScale: 1, startOpacity: 0.5, endOpacity: 1e-4, texture: "darkSmoke" });
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
/*Value list of Object.values(multiplayer.visibleUsers)[0]
e.callsign
e.aircraft (returns id)
e.distance
e.referencePoint.lla[0] and [1] for lla
e.referencePoint.lla[2] and geofs.aircraft.instance.llaLocation[2] for altitude in meters
line 17324 for other info?
*/
var shootdownNotification = new Boolean(0);
function checkAim() { //needs toggle option in options panel - just like advanced 2d clouds
   Object.values(multiplayer.visibleUsers).forEach(function(e){
	//geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])
	if (e.referencePoint.lla[2] - geofs.aircraft.instance.llaLocation[2] <= 250 && geofs.aircraft.instance.llaLocation[2] - e.referencePoint.lla[2] <= 250 && e.distance <= 3000) { //same altitude, in distance
if ((geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) <= 5 && (geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) >= -5 && geofs.animation.values.gunsOn == 1) { //place smoke emitter on "enemy" player
	 if (shootdownNotification == 0) {
	    ui.notification.show("You shot down " + e.callsign)
		 shootdownNotification = 1
		 setTimeout(() => {shootdownNotification = 0},1000)
	 }
};
if (e.aircraft == 7 || e.aircraft == 18 || e.aircraft == 15 || e.aircraft == 2581 || e.aircraft == 2808 || e.aircraft == 3591 || e.aircraft == 4172 || e.aircraft == 3617) {
	if ((geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) <= -175 && (geofs.animation.values.heading - getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])) >= 175) {
//shot-down players cannot shoot you down in turn
//needs a toggle option or circumstance
crashAircraft()
audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
ui.notification.show("You were shot down by " + e.callsign)
	}
}
   }
	})
};
goInt = setInterval(function(){checkAim()},100);
