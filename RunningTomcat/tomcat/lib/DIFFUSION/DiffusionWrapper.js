/*
 * Plugins do not know when they are being loaded.
 * This simple bit of Javascript can be called from Flash or Silverlight to drop the
 * existing connection, when the page is unloaded.
 * 
 * Once the plugin has made the connection to Diffusion, the client should call setClientDetails
 */

DiffusionWrapper = new function() {
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
		this.clientID = clientID;
	}

	this.getServerUrl = function() {
		return this.serverUrl;
	}

	this.setServerUrl = function(serverUrl) {
		this.serverUrl = serverUrl.replace("httpc", "http");			
	}
}

function closeIt() {
	DiffusionWrapper.closeClient();
}

function setClientDetails(clientId, serverUrl) {
	DiffusionWrapper.setClientID(clientId);
	DiffusionWrapper.setServerUrl(serverUrl);
	window.onbeforeunload = closeIt;
}
