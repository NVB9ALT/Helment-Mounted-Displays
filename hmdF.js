function runHMDs() {
var hmdIsActive = new Boolean(0);
geofs.animation.values.hmdShow = null;
//this is basically the 2.9 HUD, but without the attitude display.
instruments.definitions.helmetMountedDisplay = {
"overlay": {
          "url": "images/instruments/hud/frame.png",
          "size": {"x": 400, "y": 400},
          "anchor": {"x": 200, "y": 200},
          "position": {"x": window.innerWidth/2 + 200, "y": window.innerHeight/2 + 175},
          "drawOrder": 1,
          "rescale": true,
          "rescalePosition": true,
          "overlays": [
          {
            "animations": [
              {
                "type": "translateY",
                "value": "kias",
                "ratio": 2.1,
                "offset": 10,
                "min": 0,
                "max": 1200
              }
            ],
            "url": "images/instruments/hud/kias.png",
            "anchor": {"x": 0, "y": 100},
            "size": {"x": 80, "y": null},
            "position": {"x": -210, "y": 20},
            "iconFrame": {"x": 40, "y": 160},
            "drawOrder": 1
          },
          {
            "animations": [
              {
                "type": "translateY",
                "value": "altThousands",
                "ratio": 0.2385,
                "offset": 280,
                "min": 0,
                "max": 100000
              }
            ],
            "url": "images/instruments/hud/altitude.png",
            "anchor": {"x": 0, "y": 0},
            "size": {"x": 50, "y": null},
            "position": {"x": 170, "y": -150},
            "iconFrame": {"x": 32, "y": 170},
            "drawOrder": 1
          },
          {
            "animations": [
              {
                "type": "translateY",
                "value": "altThousands",
                "ratio": 0.238,
                "offset": 95,
                "min": 0,
                "max": 100000
              },
              {
                "type": "translateX",
                "value": "altTensShift",
                "ratio": -22.7,
                "min": 0,
                "max": 100000
              }
            ],
            "name": "altten",
            "url": "images/instruments/hud/altitudetens.png",
            "anchor": {"x": 0, "y": 0},
            "size": {"x": 334, "y": 200},
            "position": {"x": 155, "y": -150},
            "iconFrame": {"x": 15, "y": 170},
            "drawOrder": 1
          },
          {
            "animations": [
              {
                "type": "translateX",
                "value": "heading360",
                "ratio": -2.64,
                "offset": 12
              }
            ],
            "url": "images/instruments/hud/compass.png",
            "anchor": {"x": 0, "y": 0},
            "size": {"x": 2000, "y": null},
            "offset": {"x": 0, "y": -10},
            "position": {"x": -170, "y": -270},
            "iconFrame": {"x": 200, "y": 30},
            "drawOrder": 1
          },
          {
            "animations": [
              {
                "type": "translateY",
                "value": "machUnits",
                "ratio": 23,
                "offset": 1
              }
            ],
            "url": "images/instruments/hud/digits.png",
            "anchor": {"x": 0, "y": 0},
            "size": {"x": 11, "y": null},
            "position": {"x": -155, "y": -202},
            "iconFrame": {"x": 11, "y": 23},
            "drawOrder": 2
          },
          {
            "animations": [
              {
                "type": "translateY",
                "value": "machTenth",
                "ratio": 23,
                "offset": 1
              }
            ],
            "url": "images/instruments/hud/digits.png",
            "anchor": {"x": 0, "y": 0},
            "size": {"x": 11, "y": null},
            "position": {"x": -141, "y": -202},
            "iconFrame": {"x": 11, "y": 23},
            "drawOrder": 2
          },
          {
            "animations": [
              {
                "type": "translateY",
                "value": "machHundredth",
                "ratio": 23,
                "offset": 1
              }
            ],
            "url": "images/instruments/hud/digits.png",
            "anchor": {"x": 0, "y": 0},
            "size": {"x": 11, "y": null},
            "position": {"x": -131, "y": -202},
            "iconFrame": {"x": 11, "y": 23},
            "drawOrder": 2
          }
          ]
        }
	};
function checkIT() {
if (geofs.aircraft.instance.id == 4172 || geofs.aircraft.instance.id == 2857 || geofs.aircraft.instance.id == 7 || geofs.aircraft.instance.id == 18) {
if (hmdIsActive == 0) {
geofs.aircraft.instance.setup.instruments.helmetMountedDisplay = {"animations": [{"value": "hmdShow", "type": "show", "eq": "1"}]}
instruments.init(geofs.aircraft.instance.setup.instruments)
hmdIsActive = 1
};
if (geofs.camera.definitions["cockpit"].orientations.current[0] >= 15 || geofs.camera.definitions["cockpit"].orientations.current[0] <= -15) {
   geofs.animation.values.hmdShow = 1
   } else {
	geofs.animation.values.hmdShow = 0
   }
} else {
   hmdIsActive = 0
   }
};checkITint = setInterval(function(){checkIT()},1000);
}
