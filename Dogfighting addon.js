ui.notification.show("Press your brakes key whilst airborne to fire guns.")
setTimeout(() => {
ui.notification.show("You must be within 1 kilometer of an enemy player to shoot them down or get shot down.")
},3000)
setTimeout(() => {
console.log("DISCLAIMER: You use this add-on software of your own free choice. If you dislike the features this addon adds, you should not use it. Fighter weapons are not a default feature of GeoFS and never should be.")
}, 10)
//clearInterval(goInt)
geofs.animation.values.gunsOn = null;
geofs.animation.values.shotDown = null;
//This function/interval pair run on a different clock than the rest of the addon,
//to allow for sound loading taking upwards of half a second at times
function gunSound() {
if (geofs.animation.values.brakes == 1 && geofs.animation.values.groundContact == 0) {
   if (geofs.aircraft.instance.id == 7 || geofs.aircraft.instance.id == 18 || geofs.aircraft.instance.id == 4251 || geofs.aircraft.instance.id == 4172 || geofs.aircraft.instance.id == 3617 || geofs.aircraft.instance.id == 3591 || geofs.aircraft.instance.id == 2857 || geofs.aircraft.instance.id == 2840 || geofs.aircraft.instance.id == 2808 || geofs.aircraft.instance.id == 2581 || geofs.aircraft.instance.id == 15) {
	geofs.animation.values.gunsOn = 1
   audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/autocannon-sound.m4a")
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
   //Smoke emitter
   new geofs.fx.ParticleEmitter({ anchor: { worldPosition: [0, 0, 0] }, duration: 1e3, rate: 0.01, life: 1e4, near: 10, startScale: 0.05, endScale: 1, startOpacity: 0.5, endOpacity: 1e-4, texture: "darkSmoke" });
	audio.playShutdown();
	//Plane exploding sound
	audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
	audio.impl.html5.playFile("https://www.shockwave-sound.com/sound-effects/explosion-sounds/damage.wav")
};
//Thanks to AriakimTaiyo for most of these functions
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
function getAltDiff(self, player) {
   return Math.abs(self - player)
}
function percent(value, total) {
   //the /2 is specifically for this use case
	//the percent calculation is just (value/total) * 100
   return (Math.abs((value/total) * 100))/2
}
/*Value list of Object.values(multiplayer.users)[0]
e.callsign
e.aircraft (returns id)
e.distance
e.referencePoint.lla[0] and [1] for lla
e.referencePoint.lla[2] and geofs.aircraft.instance.llaLocation[2] for altitude in meters
e.lastUpdate.st.as for airspeed
*/
//ENTIRELY REWORKED SYSTEM:

//Modify multiplayer.sendUpdate so that notifications of a successful shootdown can be communicated from the firing player to the hit player
multiplayer.sendUpdate = function () {
    try {
        if (!multiplayer.lastRequest && !flight.recorder.playing) {
            var a = geofs.aircraft.instance,
                b = Date.now();
            multiplayer.lastRequestTime = b;
            var c = $.merge($.merge([], a.llaLocation), a.htr),
                d = V3.scale(xyz2lla(a.rigidBody.getLinearVelocity(), a.llaLocation), 0.001),
                e = $.merge(d, a.htrAngularSpeed),
                g = { gr: a.animationValue.shotDown, as: Math.round(geofs.animation.values.kias) };
            a.liveryId && (g.lv = a.liveryId);
            var f = {
                acid: geofs.userRecord.id,
                sid: geofs.userRecord.sessionId,
                id: multiplayer.myId,
                ac: a.aircraftRecord.id,
                co: c,
                ve: e,
                st: g,
                ti: multiplayer.getServerTime(),
                m: multiplayer.chatMessage,
                ci: multiplayer.chatMessageId,
		//is: geofs.animation.values.shotDown,
            };
            multiplayer.flightSharing.status &&
                multiplayer.flightSharing.peer &&
                ((f.st.sh = { pe: multiplayer.flightSharing.peer.acid }),
                multiplayer.flightSharing.control &&
                    ((f.st.sh.ct = [controls.rawPitch, controls.roll, controls.yaw, controls.throttle, controls.gear.position, controls.flaps.position, controls.airbrakes.position]),
                    (f.st.sh.ve = geofs.aircraft.instance.rigidBody.getLinearVelocity().concat(geofs.aircraft.instance.rigidBody.getAngularVelocity())),
                    (f.st.sh.st = [geofs.aircraft.instance.engine.on])));
            multiplayer.chatMessage = "";
				//This is the thing
            multiplayer.lastRequest = geofs.ajax.post(geofs.multiplayerHost + "/update", f, multiplayer.updateCallback, multiplayer.errorCallback);
        }
    } catch (k) {
        geofs.debug.error(k, "multiplayer.sendUpdate");
    }
};
//Variables
var shootdownNotification = new Boolean(0);
var shooting = new Boolean(0);
//Tick function
function checkAim() {
//For every player in render distance...
   Object.values(multiplayer.visibleUsers).forEach(function(e){
// Their range and altitude difference are crosschecked to determine if they're pointed at the target in pitch,
// and getBearing is used to make sure they're pointed at the target horizontally.
// Turns out e.distance applies for all three dimensions.
// getAltDiff(geofs.aircraft.instance.llaLocation[2], e.referencePoint.lla[2])
if (e.distance <= 1000 && (getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]) - geofs.animation.values.heading360) <= 5 && (getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]) - geofs.animation.values.heading360) >= -5 && percent(getAltDiff(geofs.aircraft.instance.llaLocation[2], e.referencePoint.lla[2]), e.distance) - Math.abs(geofs.animation.values.atilt) >= -5 && percent(getAltDiff(geofs.aircraft.instance.llaLocation[2], e.referencePoint.lla[2]), e.distance) - Math.abs(geofs.animation.values.atilt) <= 5 && geofs.animation.values.gunsOn == 1) {
	 //If we haven't shot them down yet but the necessary conditions are true
	 if (shootdownNotification == 0 && shooting == 0) {
	    ui.notification.show("You shot down " + e.callsign)
		 shootdownNotification = 1
		 shooting = 1
		 //This just makes sure that ui.notifications don't clog up on top of each other.
		 setTimeout(() => {shootdownNotification = 0; shooting = 0},2000)
	 }
}
//If their "shootdown cue" (communicated by the sendUpdate modification done above) is sent...
if (e.lastUpdate.st.gr == 1 && e.lastUpdate.st.as > 25 && shootdownNotification == 0 && (e.aircraft == 7 || e.aircraft == 18 || e.aircraft == 4251 || e.aircraft == 4172 || e.aircraft == 3617 || e.aircraft == 3591 || e.aircraft == 2857 || e.aircraft == 2840 || e.aircraft == 2808 || e.aircraft == 2581 || e.aircraft == 15)) {
   crashAircraft()
	ui.notification.show("You were shot down by " + e.callsign)
   shootdownNotification = 1
   setTimeout(() => {shootdownNotification = 0},2000)
}
   })
	//Making sure that the external variable is synced to the internal one
   geofs.animation.values.shotDown = shooting
};
//Run checkAim at 20 FPS/TPS/whatever, this is fast enough for it to not miss things most of the time but also not lag your computer
goInt = setInterval(function(){checkAim()},50);

//clearInterval(cameraRotateInt)
var needCamReset = new Boolean(0)
function look() {
   if (geofs.camera.currentModeName == "cockpit" && geofs.animation.values.accZ >= 40) {
geofs.camera.setRotation(geofs.animation.values.roll * 100, (geofs.animation.values.pitch * 125)-10, 0)
needCamReset = 1
   } else if (geofs.camera.currentModeName == "cockpit" && needCamReset == 1) {
geofs.camera.setRotation(geofs.aircraft.instance.definition.cameras.cockpit.orientation[0], geofs.aircraft.instance.definition.cameras.cockpit.orientation[1], geofs.aircraft.instance.definition.cameras.cockpit.orientation[2])
needCamReset = 0
	} else {
needCamReset = 0
	}
}
cameraRotateInt = setInterval(function(){look()},100)

// C cycles between just follow and cockpit
geofs.camera.cycle = function(){
   if (geofs.camera.currentModeName == "cockpit") {
geofs.camera.set(0)
   } else {
geofs.camera.set(1)
	}
}
