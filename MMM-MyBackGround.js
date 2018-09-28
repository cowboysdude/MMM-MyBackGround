/* Magic Mirror
 * Module: MMM-MyBackGround
 *
 * By Cowboysdude
 * MIT Licensed.
 */
var weather;

Module.register("MMM-MyBackGround", {

    defaults: {
        updateInterval: 60 * 1000,
        background: "",
        videod: [""],
        videon: [""],
        animationSpeed: 3500,
        initialLoadDelay: 6250,
    },

    start: function() {
        console.log("Starting background...syncing with NOAA3...and getting info, hang on.");
        this.scheduleUpdate();
    },

    getStyles: function() {
        return ["MMM-MyBackGround.css"]
    },

    getScripts: function() {
        return ["moment.js"]
    },

    getInfo: function() {
        this.sendSocketNotification('GET_INFO');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SRSS_RESULTS") {
            this.processInfo(payload);
        }
        this.updateDom(this.config.animationSpeed);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getInfo();
            console.log("updating background......");
        }, this.config.updateInterval);
        this.getInfo(this.config.initialLoadDelay);
    },

    processInfo: function(data) {
        this.today = data.Today;
        this.info = data.results;
        this.loaded = true;
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "WEATHER" && sender.name === "MMM-NOAA3") {
            weather = payload;
        } else {
		console.log("Must be running NOAA3 for MMM-MyBackGround to work!");	
		}
    },

    getDom: function() {

        var info = this.info;

        if (typeof info != 'undefined') {
            var set = moment(info.sunset).format('HH');
            var rise = moment(info.sunrise).format('HH');
        }

        var videod = this.config.videod;
        var videon = this.config.videon;
        videod = videod[Math.floor(Math.random() * videod.length)];
        videon = videon[Math.floor(Math.random() * videon.length)];
        var day = moment().format('HH');
        var night = moment().format('HH');

        var image = weather.icon;

        var wrapper = document.createElement("div");
        if (this.config.background == "") {
            wrapper.classList.add("font");
            wrapper.innerHTML = "<center>MMM-MyBackGround</center><BR>Please set background config either 'image' or 'video' <BR> like this -> <br>{<BR>disabled: false,<BR>module: 'MMM-MyBackGround',<br>position: 'top_left',<br>config: {<br>background: 'video' //or 'image'<br>}</font>";
        } else if (this.config.background == "image") {
            if (night >= set) {
                wrapper.innerHTML = '<img src = modules/MMM-MyBackGround/images/n_' + image + '.jpg id="bg">';
            } else {
                wrapper.innerHTML = '<img src = modules/MMM-MyBackGround/images/' + image + '.jpg id="bg">';
            }
        } else {
            if (videon == "" || videod == "") {
                wrapper.classList.add("font");
                wrapper.innerHTML = 'Please add videos like this <BR> ["video_name"] to make Background work! <br><BR>{<BR>disabled: false,<BR>module: "MMM-MyBackGround",<br>position: "top_left",<br>config: {<br>background: "video", //or "image"<br>videod: ["day", "day1"],<br>vidoen: ["night", "night1"]<br>}<br> SEE README ON GITHUB';
            } else if (videon != "" || videod != "") {
                if (night >= set) {
                    wrapper.innerHTML = `<video autoplay muted loop id="video"><source src="modules/MMM-MyBackGround/videos/${videon}.mp4" type="video/mp4"></video>`;
                } else {
                    wrapper.innerHTML = `<video autoplay muted loop id="video"><source src="modules/MMM-MyBackGround/videos/${videod}.mp4" type="video/mp4"></video>`;
                }
            }
            console.log(wrapper.innerHTML);
        }
        return wrapper;
    },
});