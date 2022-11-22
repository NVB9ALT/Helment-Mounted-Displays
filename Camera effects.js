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
