/*
 * DEPRECATED since 4.4
 * This Script is discouraged from using, please use DiffusioWrapper.js
 * 
 */

FlashWrapper = new function() {
	this.clientID = null;
	this.serverUrl = null;
	this.iframe = null;
	this.url = null;

	if (navigator.appVersion.match('MSIE') == 'MSIE') {
		this.isIE = true;
	} else {
		this.isIE = false;
	}

	if (navigator.appVersion.match('MSIE 9.0') == 'MSIE 9.0') {
		this.isIE9 = true;
	} else {
		this.isIE9 = false;
	}

	this.closeClient = function() {
		DiffusionClient.trace("FlashWrapper#closeClient: This class is now DEPRECATED. Please use DiffusionWrapper.js");
		
		if (this.isIE && !this.isIE9) {
			try {
				this.iframe = document
						.createElement('<iframe name="closeFrame" src="'
								+ this.serverUrl + '">');
				document.body.appendChild(this.iframe);
			} catch (e) {
			}

		} else {
			this.iframe = document.createElement("iframe");
			this.iframe.setAttribute("id", "closeFrame");
			this.iframe.src = this.serverUrl;
			document.body.appendChild(this.iframe);
		}
		with (this.iframe) {
			style.left = "0px";
			style.top = "0px";
			style.height = "0px";
			style.width = "0px";
			style.border = "0px";
		}

		this.url = this.serverUrl + "/diffusion?m=29&c=" + this.clientID
		if (this.isIE) {
			if (this.iframe != null) {
				this.iframe.src = this.url;
			}
		} else {
			try {
				this.iframe.contentDocument.location.replace(this.url);
			} catch (e) {
			}
		}
	}

	this.setClientID = function(clientID) {
		DiffusionClient.trace("FlashWrapper#setClientID: This class is now DEPRECATED. Please use DiffusionWrapper.js");
		this.clientID = clientID;
	}

	this.getServerUrl = function() {
		DiffusionClient.trace("FlashWrapper#getServerUrl: This class is now DEPRECATED. Please use DiffusionWrapper.js");
		return this.serverUrl;
	}

	this.setServerUrl = function(serverUrl) {
		DiffusionClient.trace("FlashWrapper#setServerUrl: This class is now DEPRECATED. Please use DiffusionWrapper.js");
		this.serverUrl = serverUrl;
	}
}

function closeIt() {
	DiffusionClient.trace("FlashWrapper#closeIt: This class is now DEPRECATED. Please use DiffusionWrapper.js");
	FlashWrapper.closeClient();
}

function setClientDetails(clientId, serverUrl) {
	DiffusionClient.trace("FlashWrapper#setClientDetails: This class is now DEPRECATED. Please use DiffusionWrapper.js");
	FlashWrapper.setClientID(clientId);
	FlashWrapper.setServerUrl(serverUrl);
	window.onbeforeunload = closeIt;
}
