/* global Module */

/* Magic Mirror
 * Module: MMM-Awesome-Alexa
 *
 * By Dolan Miu http://www.dolan.bio
 * MIT Licensed.
 */
var avsWrapper;
var vadWrapper;
var alexaWrapper;
Module.register("MMM-alexa-hands-free", {

    // Default module config.
    defaults: {
        text: "Hello World!",
    },

    start: function () {
        // Needed to initially connect to node_helper;
        this.sendSocketNotification("ADD_FEED", { "test": "test" });
        avsWrapper = new AlexaVoiceService.AVSWrapper(() => {
            alexaWrapper.classList.add("wrapper-active");
            document.body.classList.add("down-size");
        }, () => {
            alexaWrapper.classList.remove("wrapper-active");
            document.body.classList.remove("down-size");
        });

        avsWrapper.init();

        vadWrapper = new AlexaVoiceService.VADWrapper();

        vadWrapper.start(() => {
            if (avsWrapper.IsRecording) {
                avsWrapper.stopRecording();
            }
        });
    },

    getDom: function () {
        alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        return alexaWrapper;
    },

    getScripts: function () {
        return [
            this.file("dist/bundle.js"),
        ];
    },

    getStyles: function () {
        return [
            this.file("styles/global.css"),
        ];
    },

    socketNotificationReceived: function (notification, payload) {
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        avsWrapper.startRecording();
    },
});