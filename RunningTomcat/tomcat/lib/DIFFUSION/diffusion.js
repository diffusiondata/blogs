DiffusionClient=new function(){this.version="4.5.2";this.buildNumber="01";this.isInvalidFunction=false;
this.listeners=[];this.serviceListeners=[];this.credentials=null;this.topicListenerRef=0;this.serviceListenerRef=0;
this.reconnectAttempts=0;this.isDebugging=false;this.serverProtocolVersion=-1;this.messageLengthSize=-1;
this.fragmentMap={};if(navigator.appVersion.match("MSIE")=="MSIE"){this.isIE=true}else{this.isIE=false
}if(navigator.appVersion.match("MSIE 9.0")=="MSIE 9.0"){this.isIE9=true}else{this.isIE9=false}if(navigator.userAgent.indexOf("Firefox")==-1){this.isFirefox=false
}else{this.isFirefox=true}if(navigator.platform.indexOf("Win")==-1){this.isWindows=false}else{this.isWindows=true
}this.connect=function(b,c){DiffusionClient.close();if(c){this.setCredentials(c)}this.connectionDetails=this.extend(new DiffusionClientConnectionDetails(),b);
if(this.connectionDetails.debug==true){this.setDebugging(true)}this.trace(navigator.userAgent);this.trace("DiffusionClient: Version "+this.version+" build "+this.buildNumber);
if(typeof b.onInvalidClientFunction=="function"){this.isInvalidFunction=true}setTimeout(function(){if(DiffusionClient.diffusionTransport.isConnected==false){if(typeof DiffusionClient.connectionDetails.callbackFunction=="function"){DiffusionClient.connectionDetails.callbackFunction(false)
}}},this.connectionDetails.timeoutMS);var a=document.getElementById("DiffusionContainer");if(a==null){a=document.createElement("div");
a.id="DiffusionContainer";a.style.width="0px";a.style.height="0px";document.body.appendChild(a)}this.diffusionTransport=new DiffusionClientTransport();
this.diffusionTransport.cascade();window.onbeforeunload=function(){if(typeof DiffusionClient.connectionDetails.onBeforeUnloadFunction=="function"){DiffusionClient.connectionDetails.onBeforeUnloadFunction()
}if(DiffusionClient.diffusionTransport!=null){if(DiffusionClient.diffusionTransport.isConnected){DiffusionClient.close()
}}};document.onkeydown=this.checkEscape;document.onkeypress=this.checkEscape};this.reconnect=function(){if(DiffusionClient.diffusionTransport&&!DiffusionClient.diffusionTransport.isConnected&&DiffusionClient.getClientID()){this.diffusionTransport.reconnect()
}};this.isConnected=function(){if(DiffusionClient.diffusionTransport){return DiffusionClient.diffusionTransport.isConnected
}return false};this.isReconnected=function(){if(DiffusionClient.diffusionTransport){return DiffusionClient.diffusionTransport.isConnected&&DiffusionClient.diffusionTransport.isReconnected
}return false};this.setCredentials=function(a){if(a!=null){this.credentials=this.extend(new DiffusionClientCredentials(),a)
}};this.getCredentials=function(){return this.credentials};this.subscribe=function(a){if(this.isTransportValid()){this.diffusionTransport.subscribe(a)
}};this.unsubscribe=function(a){if(this.isTransportValid()){this.diffusionTransport.unsubscribe(a)}};
this.sendTopicMessage=function(b){if(this.isTransportValid()){var a=b.getMessage();if((a!=null&&a!="")||b.userHeaders!=null){this.diffusionTransport.sendTopicMessage(b)
}}};this.send=function(a,b){if(this.isTransportValid()){if(b!=null&&b!=""){this.diffusionTransport.send(a,b)
}}};this.sendCredentials=function(a){if(this.isTransportValid()){this.setCredentials(a);this.diffusionTransport.sendCredentials(a)
}};this.ping=function(){if(this.isTransportValid()){this.diffusionTransport.ping()}};this.acknowledge=function(b){if(this.isTransportValid()){var a=b.getAckID();
if(a!=null){this.diffusionTransport.sendAckResponse(a);b.setAcknowledged()}}};this.fetch=function(a,b){if(this.isTransportValid()){if(b){this.diffusionTransport.fetch(a,b)
}else{this.diffusionTransport.fetch(a,null)}}};this.command=function(c,a,b){if(this.isTransportValid()){this.diffusionTransport.command(c,a,b)
}};this.page=function(a,b){if(this.isTransportValid()){this.diffusionTransport.command(a,null,b)}};this.isTransportValid=function(){if(!this.diffusionTransport){return false
}else{return this.diffusionTransport.isValid()}};this.close=function(){if(this.diffusionTransport!=null){this.diffusionTransport.close()
}};this.addTopicListener=function(b,d,a){var c=this.topicListenerRef++;if(typeof a=="undefined"){a=arguments.callee
}this.listeners.push(new TopicListener(b,d,c,a));return c};this.addTimedTopicListener=function(b,f,e,d,a){var c=this.topicListenerRef++;
if(typeof a=="undefined"){a=arguments.callee}this.listeners.push(new TimedTopicListener(b,f,c,e,d,a));
return c};this.addServiceListener=function(b,d,a){var c=this.serviceListenerRef++;if(typeof a=="undefined"){a=arguments.callee
}this.serviceListeners.push(new TopicListener(b,d,c,a));return c};this.createServiceTopicHandler=function(b,a){return this.addServiceListener("^"+b.getTopic()+"$",a)
};this.removeTopicListener=function(b){var c;for(var a=0;a<this.listeners.length;a++){c=this.listeners[a];
if(c.getHandle()==b){this.listeners.splice(a,1);return}}};this.removeTimedTopicListener=function(b){var c;
for(var a=0;a<this.listeners.length;a++){c=this.listeners[a];if(c.getHandle()==b){c.stop();this.listeners.splice(a,1);
return}}};this.removeAllTopicListeners=function(){this.listeners=[]};this.checkEscape=function(a){if(!a){a=event
}if(a.keyCode==27){return false}};this.extend=function(c,a){for(var b in a){c[b]=a[b]}return c};this.bind=function(a,b){return function(){var c=Array.prototype.slice.call(arguments,0);
return a.apply(b,c)}};this.getClientID=function(){return this.diffusionTransport.clientID};this.getClientProtocolVersion=function(){return 4
};this.getTransportName=function(){return this.diffusionTransport.transportName};this.getServerProtocolVersion=function(){return this.serverProtocolVersion
};this.setDebugging=function(a){if(a==false){this.trace=function(b){};this.isDebugging=false}else{this.isDebugging=true;
if(window.console&&window.console.log){this.trace=function(b){console.log(DiffusionClient.timestamp()+b)
}}else{if(window.opera&&opera.postError){this.trace=function(b){opera.postError(DiffusionClient.timestamp()+b)
}}else{this.isDebugging=false;this.trace=function(b){}}}}};this.trace=function(a){};this.timestamp=function(){var a=new Date();
return a.getHours()+":"+a.getMinutes()+":"+a.getSeconds()+"."+a.getMilliseconds()+" : "};this.getLastInteraction=function(){return this.diffusionTransport.getLastInteraction()
};this.hasFlash=function(b){if(window.ActiveXObject){try{obj=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
ver=obj.GetVariable("$version").replace(/([a-z]|[A-Z]|\s)+/,"").split(",");if(ver[0]>=b){return true}}catch(d){return false
}}if(navigator.plugins&&navigator.mimeTypes.length){try{var a=navigator.plugins["Shockwave Flash"];if(a&&a.description){ver=a.description.replace(/([a-z]|[A-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split(".");
if(ver[0]>=b){return true}}else{return false}}catch(c){return false}}};this.hasSilverlight=function(){try{var b=null;
if(this.isIE){b=new ActiveXObject("AgControl.AgControl");if(b){return b.isVersionSupported("4.0.5")}else{return false
}}if(navigator.plugins["Silverlight Plug-In"]){container=document.createElement("div");document.body.appendChild(container);
container.innerHTML='<embed type="application/x-silverlight" src="data:," />';b=container.childNodes[0];
var a=b.isVersionSupported("4.0.5");document.body.removeChild(container);return a}return false}catch(c){return false
}};this.getWebSocket=function(b){var a=null;if("WebSocket" in window){a=new WebSocket(b)}else{if("MozWebSocket" in window){a=new MozWebSocket(b)
}}return a}};DiffusionClientTransport=function(){this.clientID;this.transportName;this.isClosing=false;
this.isConnected=false;this.isReconnected=false;this.isReconnecting=false;this.messageCount=0;this._cd=DiffusionClient.connectionDetails;
this._dc=DiffusionClient;this.aliasMap=[];this.transports=[];this.transports.push({name:"WebSocket",transport:new DiffusionWSTransport()});
this.transports.push({name:"Flash",transport:new DiffusionFlashTransport()});this.transports.push({name:"Silverlight",transport:new DiffusionSilverlightTransport()});
this.transports.push({name:"XmlHttpRequest",transport:new DiffusionXHRTransport()});this.transports.push({name:"Iframe",transport:new DiffusionIframeTransport});
this.nextAckSequence=0;this.ackManager=[];this.lastInteraction};DiffusionClientTransport.prototype.cascade=function(){if(this.isReconnecting){this.isReconnecting=this.isReconnected=false;
if(typeof this._cd.onCallbackFunction=="function"){this._cd.onCallbackFunction(false,true)}return}if(this.transports.length>0){var a=this.transports.shift();
this.transport=a.transport;this.transportName=a.name;if(typeof this._cd.onCascadeFunction=="function"){this._cd.onCascadeFunction(a.name)
}DiffusionClient.trace("Transport: cascade: about to attempt to connect to "+a.name);this.lastInteraction=new Date().getTime();
this.transport.connect()}else{if(typeof this._cd.onCascadeFunction=="function"){this._cd.onCascadeFunction("None")
}if(typeof this._cd.onCallbackFunction=="function"){this._cd.onCallbackFunction(false)}}};DiffusionClientTransport.prototype.reconnect=function(){if(!this.isConnected&&!this.isReconnecting){this.isClosing=false;
this.isReconnecting=true;this.transport.connect(true)}};DiffusionClientTransport.prototype.getLastInteraction=function(){return this.lastInteraction
};DiffusionClientTransport.prototype.isValid=function(){if(this.isConnected==false||this.isClosing==true){if(this._dc.isInvalidFunction){this._cd.onInvalidClientFunction()
}return false}this.lastInteraction=new Date().getTime();return true};DiffusionClientTransport.prototype.connectionRejected=function(){if(typeof DiffusionClient.connectionDetails.onConnectionRejectFunction=="function"){DiffusionClient.connectionDetails.onConnectionRejectFunction()
}};DiffusionClientTransport.prototype.close=function(){this.isConnected=false;this.isClosing=true;this.isReconnected=false;
this.isReconnecting=false;if(this.transport!=null){this.transport.close()}};DiffusionClientTransport.prototype.sendTopicMessage=function(b){DiffusionClient.trace("Sending topic message..."+b.getMessage());
if(b.getAckRequired()){var a=new DiffusionAckProcess(b);this.ackManager[b.getAckID()]=a}this.transport.sendTopicMessage(b)
};DiffusionClientTransport.prototype.send=function(a,b){DiffusionClient.trace("Sending ..."+b);this.transport.send(a,b)
};DiffusionClientTransport.prototype.subscribe=function(a){DiffusionClient.trace("Subscribe ... "+a);
this.transport.subscribe(a)};DiffusionClientTransport.prototype.unsubscribe=function(a){DiffusionClient.trace("Unsubscribe ... "+a);
this.transport.unsubscribe(a)};DiffusionClientTransport.prototype.sendAckResponse=function(a){DiffusionClient.trace("Send ack response "+a);
this.transport.sendAckResponse(a)};DiffusionClientTransport.prototype.sendCredentials=function(a){DiffusionClient.trace("Send credentials ");
this.transport.sendCredentials(a)};DiffusionClientTransport.prototype.fetch=function(a,b){if(b){DiffusionClient.trace("Fetch "+a+" : "+b);
this.transport.fetch(a,b)}else{DiffusionClient.trace("Fetch "+a);this.transport.fetch(a,null)}};DiffusionClientTransport.prototype.command=function(c,a,b){DiffusionClient.trace("Send command "+c);
this.transport.command(c,a,b)};DiffusionClientTransport.prototype.page=function(a,b){DiffusionClient.trace("Send page command "+a);
this.transport.command(a,null,b)};DiffusionClientTransport.prototype.connected=function(a){this._dc.trace("Client ID = "+a);
this.isConnected=true;if(this.isReconnecting){this.isReconnecting=false;this.isReconnected=(this.clientID==a)
}this.clientID=a;if(typeof this._cd.onCallbackFunction=="function"){this._cd.onCallbackFunction(true,this.isReconnected)
}this.lastInteraction=new Date().getTime()};DiffusionClientTransport.prototype.ping=function(){if(!this.isClosing&&!this.isClosed){this.transport.ping(new Date().getTime(),"0")
}};DiffusionClientTransport.prototype.handleMessages=function(c){this.lastInteraction=new Date().getTime();
try{if(c!=""){var b=c.split("\u0008");do{var r=b.shift();var a=r.charCodeAt(0);if((a&64)===64){var p=new FragmentedMessage(r);
var n=p.process();if(n===null){continue}r=n}var k=r.charCodeAt(0)&~64;switch(k){case 28:if(typeof this._cd.onAbortFunction=="function"){this._cd.onAbortFunction()
}this.isClosing=true;return;case 24:if(typeof this._cd.onPingFunction=="function"){this._cd.onPingFunction(new PingMessage(r))
}break;case 25:var g=r.split("\u0002")[0];var m=g.substr(1,(g.length-2));this.transport.sendClientPingResponse(m);
break;case 27:if(typeof this._cd.onServerRejectedCredentialsFunction=="function"){this._cd.onServerRejectedCredentialsFunction()
}break;case 29:this.isClosing=true;this.isConnected=false;this.isReconnecting=false;if(typeof this._cd.onLostConnectionFunction=="function"){this._cd.onLostConnectionFunction()
}return;case 32:var o=parseInt(r.substr(1,(r.length-1)));this.processAckResponse(o);break;case 35:var c=r.substr(1,(r.length-2));
var g=c.split("\u0002");var f=g[0].split("!");if(f.length>1){delete this.aliasMap[f[1]]}if(typeof this._cd.onTopicStatusFunction=="function"){var d=null;
if(f.length>1){d=f[1]}var q=new TopicStatusMessage(f[0],d,g[1]);this._cd.onTopicStatusFunction(q)}break;
case 40:case 41:var j=new CommandMessage(r,this.messageCount++);this.aliasCheck(j);this.dispatchMessage(j);
break;case 42:var c=r.substr(1,(r.length-2));DiffusionClient.fragmentMap[c]=undefined;break;default:try{var h=new WebClientMessage(r,this.messageCount++);
if(h.isAckMessage()&&this._cd.autoAck){this.transport.sendAckResponse(h.getAckID());h.setAcknowledged()
}this.aliasCheck(h);this.dispatchMessage(h)}catch(l){DiffusionClient.trace("DiffusionClient: Error processing data "+l)
}break}}while(b.length)}}catch(l){DiffusionClient.trace("DiffusionClient:  Error processing data "+l)
}};DiffusionClientTransport.prototype.aliasCheck=function(b){if(b.isInitialTopicLoad()){var a=b.getTopic().split("!");
if(a.length==2){this.aliasMap[a[1]]=a[0];b.setTopic(a[0])}}else{if(b.getTopic().charCodeAt(0)==33){b.setTopic(this.aliasMap[b.getTopic().substr(1)])
}}};DiffusionClientTransport.prototype.dispatchMessage=function(a){var b=false;if(a instanceof CommandMessage){b=this.dispatchToListeners(DiffusionClient.serviceListeners,a)
}if(!b){b=this.dispatchToListeners(DiffusionClient.listeners,a)}if(!b){this._cd.onDataFunction(a)}};DiffusionClientTransport.prototype.dispatchToListeners=function(g,c){if(g.length>0){var a=g.slice(0).reverse();
var b=a.length;do{--b;var f=a[b];if(c.getTopic().match(f.getRegex())){try{if(f.callFunction(c)==true){return true
}}catch(d){DiffusionClient.trace("Problem with topicListener "+f.handle+" : "+d)}}}while(b)}return false
};DiffusionClientTransport.prototype.getNextAckID=function(){return this.nextAckSequence++};DiffusionClientTransport.prototype.processAckResponse=function(b){var a=this.ackManager[b];
if(a!=null){a.cancel();delete this.ackManager[b]}};DiffusionWSTransport=function(){this.webSocket;this.hasConnected=false;
this.timeoutVar};DiffusionWSTransport.prototype.send=function(a,b){this.writeBytes("\u0015"+a+"\u0001"+b)
};DiffusionWSTransport.prototype.sendTopicMessage=function(c){var a;if(c.getAckRequired()){a="\u001F"+c.getTopic()+"\u0002"+c.getAckID()
}else{a="\u0015"+c.getTopic()}var b=c.getUserHeaders();if(b!=null&&b.length>0){a+="\u0002";a+=b.join("\u0002")
}a+="\u0001";a+=c.getMessage();this.writeBytes(a)};DiffusionWSTransport.prototype.sendCredentials=function(a){this.writeBytes("\u001a"+a.toRecord())
};DiffusionWSTransport.prototype.subscribe=function(a){this.writeBytes("\u0016"+a)};DiffusionWSTransport.prototype.unsubscribe=function(a){this.writeBytes("\u0017"+a)
};DiffusionWSTransport.prototype.ping=function(a,b){this.writeBytes("\u0018"+a+"\u0002"+b)};DiffusionWSTransport.prototype.sendAckResponse=function(a){this.writeBytes("\u0020"+a)
};DiffusionWSTransport.prototype.fetch=function(a,b){if(b!=null){this.writeBytes("\u0021"+a+"\u0002"+b)
}else{this.writeBytes("\u0021"+a)}};DiffusionWSTransport.prototype.command=function(e,b,d){var a;a="\u0024"+d.getTopic()+"\u0002"+e;
if(b!==undefined&&b!==null){a+="\u0002"+b}var c=d.getUserHeaders();if(c!=null&&c.length>0){a+="\u0002";
a+=c.join("\u0002")}a+="\u0001";if(d.getMessage()){a+=d.getMessage()}this.writeBytes(a)};DiffusionWSTransport.prototype.close=function(){this.writeBytes("\u001D");
if(this.webSocket!=null){this.webSocket.onclose=null;this.webSocket.close()}};DiffusionWSTransport.prototype.sendClientPingResponse=function(a){this.writeBytes("\u0019"+a+"\u0001")
};DiffusionWSTransport.prototype.connect=function(a){var d=DiffusionClient.connectionDetails;if(d.disableWS){DiffusionClient.diffusionTransport.cascade();
return}this.hasConnected=false;DiffusionClient.trace("WebSocket connect");try{var c=d.wsURL+d.context+"/diffusion?t="+encodeURIComponent(DiffusionClient.connectionDetails.topic)+"&v="+DiffusionClient.getClientProtocolVersion()+"&ty=WB";
if(a){c+="&c="+DiffusionClient.getClientID()}if(DiffusionClient.credentials!=null){c+="&username="+encodeURIComponent(DiffusionClient.credentials.username)+"&password="+encodeURIComponent(DiffusionClient.credentials.password)
}DiffusionClient.trace("WebSocket URL: "+c);var b=DiffusionClient.getWebSocket(c);if(b==null){DiffusionClient.diffusionTransport.cascade();
return}this.webSocket=b;this.webSocket.onopen=DiffusionClient.bind(this.onWSConnect,this);this.webSocket.onclose=DiffusionClient.bind(this.onWSClose,this);
this.webSocket.onmessage=DiffusionClient.bind(this.onWSHandshake,this);this.timeoutVar=setTimeout(DiffusionClient.bind(this.onTimeout,this),d.wsTimeout)
}catch(f){DiffusionClient.trace("WebSocket connect exception "+f);clearTimeout(this.timeoutVar);DiffusionClient.diffusionTransport.cascade();
return}};DiffusionWSTransport.prototype.writeBytes=function(a){try{this.webSocket.send(a)}catch(b){DiffusionClient.trace("WebSocket: Unable to send message: "+a)
}};DiffusionWSTransport.prototype.onTimeout=function(){if(!this.hasConnected){DiffusionClient.trace("WebSocket Timeout Cascade");
this.webSocket.onopen=null;this.webSocket.onclose=null;this.webSocket.onmessage=null;if(this.webSocket!=null){this.webSocket.close()
}DiffusionClient.diffusionTransport.cascade()}};DiffusionWSTransport.prototype.onWSConnect=function(a){DiffusionClient.trace("onWSConnect");
clearTimeout(this.timeoutVar)};DiffusionWSTransport.prototype.onWSHandshake=function(a){var b=a.data.split("\u0002");
DiffusionClient.serverProtocolVersion=parseInt(b.shift());if(b[0]=="100"||b[0]=="105"){this.hasConnected=true;
this.webSocket.onmessage=DiffusionClient.diffusionTransport.transport.onWSMessage;DiffusionClient.diffusionTransport.connected(b[1])
}else{if(b[0]=="111"){DiffusionClient.diffusionTransport.connectionRejected()}}};DiffusionWSTransport.prototype.onWSMessage=function(a){DiffusionClient.trace("WebSocket: "+a.data);
DiffusionClient.diffusionTransport.handleMessages(a.data)};DiffusionWSTransport.prototype.onWSClose=function(a){DiffusionClient.trace("onWSClose "+this.hasConnected);
clearTimeout(this.timeoutVar);if(!this.hasConnected||(a.wasClean!=="undefined"&&a.wasClean===false)){DiffusionClient.diffusionTransport.cascade();
return}if(DiffusionClient.diffusionTransport.isClosing!=true){DiffusionClient.diffusionTransport.isClosing=true;
DiffusionClient.diffusionTransport.isConnected=false;if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction()
}}};DiffusionFlashTransport=function(){this.flashConnection=null;this.segments=new Array()};DiffusionFlashTransport.prototype.close=function(){try{if(this.flashConnection!=null){this.flashConnection.close()
}}catch(a){}};DiffusionFlashTransport.prototype.sendTopicMessage=function(a){this.flashConnection.sendTopicMessage(a.toRecord())
};DiffusionFlashTransport.prototype.sendCredentials=function(a){this.flashConnection.sendCredentials(a.toRecord())
};DiffusionFlashTransport.prototype.send=function(b,a){this.flashConnection.send(b,a)};DiffusionFlashTransport.prototype.command=function(c,a,b){this.flashConnection.command(c,a,b.toRecord())
};DiffusionFlashTransport.prototype.subscribe=function(a){this.flashConnection.subscribe(a)};DiffusionFlashTransport.prototype.unsubscribe=function(a){this.flashConnection.unsubscribe(a)
};DiffusionFlashTransport.prototype.ping=function(a,b){this.flashConnection.ping(a,b)};DiffusionFlashTransport.prototype.fetch=function(a,b){if(b){a+="\u0003"+b
}this.flashConnection.fetch(a)};DiffusionFlashTransport.prototype.connect=function(b){var c=DiffusionClient.connectionDetails;
if(b&&this.flashConnection!=null){this.flashConnection.reconnect();return}if(c.disableFlash){DiffusionClient.diffusionTransport.cascade();
return}if(!DiffusionClient.hasFlash(9)){DiffusionClient.diffusionTransport.cascade();return}DiffusionClient.trace("Flash connect");
this.clearPlugin();var e=DiffusionClient.connectionDetails.context+c.libPath+"/DiffusionClient.swf?v=4.5.2_01&host="+c.flashHost+"&port="+c.flashPort+"&topic="+encodeURIComponent(c.topic);
e+="&batch=DiffusionClient.diffusionTransport.transport.onFlashBatch&callback=DiffusionClient.diffusionTransport.transport.onFlashConnect&onDataEvent=DiffusionClient.diffusionTransport.handleMessages";
e+="&transport="+c.flashTransport+"&durl="+c.flashURL+"&tio="+c.flashTimeout;if(DiffusionClient.credentials!=null){e+="&username="+encodeURIComponent(DiffusionClient.credentials.username)+"&password="+encodeURIComponent(DiffusionClient.credentials.password)
}if(DiffusionClient.isDebugging){e+="&onTrace=DiffusionClient.trace"}if(DiffusionClient.isIE){e+="&date="+new Date()
}var d='<object width="0" height="0" id="DiffusionClientFlash" type="application/x-shockwave-flash" data="'+e+'" >';
d+='<param name="allowScriptAccess" value="always" />';d+='<param name="bgcolor" value="#ffffff" />';
d+='<param name="movie" value="'+e+'" />';d+='<param name="scale" value="noscale" />';d+='<param name="salign" value="lt" />';
d+="</object>";var a=document.getElementById("DiffusionContainer");var f=document.createElement("div");
f.innerHTML=d;a.appendChild(f);this.timeoutVar=setTimeout(DiffusionClient.bind(this.onTimeout,this),c.cascadeTimeout)
};DiffusionFlashTransport.prototype.onTimeout=function(){DiffusionClient.trace("Flash Timeout Cascade");
if(!DiffusionClient.diffusionTransport.isReconnecting){this.clearPlugin()}DiffusionClient.diffusionTransport.cascade()
};DiffusionFlashTransport.prototype.clearPlugin=function(){try{var a=document.getElementById("DiffusionContainer");
var c=document.getElementById("DiffusionClientFlash");if(c!=null){var b=c.parentNode;b.removeChild(c);
a.removeChild(b)}}catch(d){}};DiffusionFlashTransport.prototype.onFlashConnect=function(a){clearTimeout(this.timeoutVar);
if(a==false){DiffusionClient.trace("Flash Connection not successful.");DiffusionClient.diffusionTransport.cascade();
return}else{var b=a.split("\u0002");DiffusionClient.serverProtocolVersion=b[0];DiffusionClient.trace("Flash Connection successful.");
this.flashConnection=document.DiffusionClientFlash;if(this.flashConnection==null){this.flashConnection=window.DiffusionClientFlash
}DiffusionClient.diffusionTransport.connected(b[1])}};DiffusionFlashTransport.prototype.onFlashBatch=function(a){if(a.charAt(0)=="\u0003"){this.segments.push(a.substr(1));
DiffusionClient.diffusionTransport.handleMessages(this.segments.join(""));this.segments=new Array()}else{this.segments.push(a);
DiffusionClient.trace("Segment "+this.segments.length)}};DiffusionSilverlightTransport=function(){this.silverlightConnection=null
};DiffusionSilverlightTransport.prototype.close=function(){if(this.silverlightConnection!=null){this.silverlightConnection.close()
}};DiffusionSilverlightTransport.prototype.send=function(b,a){this.silverlightConnection.send(b,a)};DiffusionSilverlightTransport.prototype.command=function(c,a,b){this.silverlightConnection.command(c,a,b.toRecord())
};DiffusionSilverlightTransport.prototype.sendTopicMessage=function(a){this.silverlightConnection.sendTopicMessage(a.toRecord())
};DiffusionSilverlightTransport.prototype.sendCredentials=function(a){this.silverlightConnection.sendCredentials(a.toRecord())
};DiffusionSilverlightTransport.prototype.subscribe=function(a){this.silverlightConnection.subscribe(a)
};DiffusionSilverlightTransport.prototype.unsubscribe=function(a){this.silverlightConnection.unsubscribe(a)
};DiffusionSilverlightTransport.prototype.ping=function(a,b){this.silverlightConnection.ping(a,b)};DiffusionSilverlightTransport.prototype.sendAckResponse=function(a){this.silverlightConnection.sendAckResponse(a)
};DiffusionSilverlightTransport.prototype.fetch=function(a,b){if(b){a+="\u0003"+b}this.silverlightConnection.fetch(a)
};DiffusionSilverlightTransport.prototype.connect=function(b){if(b&&this.silverlightConnection!=null){this.silverlightConnection.reconnect();
return}var c=DiffusionClient.connectionDetails;if(c.disableSilverlight){DiffusionClient.diffusionTransport.cascade();
return}if(!DiffusionClient.hasSilverlight()){DiffusionClient.diffusionTransport.cascade();return}DiffusionClient.trace("Silverlight connect");
this.clearPlugin();var h=DiffusionClient.connectionDetails.context+c.libPath+"/DiffusionClient.xap?v=4.5.2_01";
var d='<object data="data:application/x-silverlight-2," id="DiffusionClientSilverlight" type="application/x-silverlight-2" width="1" height="1">';
d+='<param name="source" value="'+h+'" />';d+='<param name="onError" value="DiffusionClient.diffusionTransport.transport.onSilverlightError" />';
var g;if(c.topic!=null){g=c.topic.split(",").join("|")}else{g=""}var f="host="+c.silverlightHost+",port="+c.silverlightPort+",topic="+g+",onDataEvent=DiffusionClient.diffusionTransport.handleMessages,";
f+="callback=DiffusionClient.diffusionTransport.transport.onSilverlightConnect,transport="+c.silverlightTransport+",durl="+c.silverlightURL;
if(b){f+=",clientid="+DiffusionClient.getClientID()}if(DiffusionClient.credentials!=null){f+=",username="+DiffusionClient.credentials.username+",password="+DiffusionClient.credentials.password
}if(DiffusionClient.isDebugging){f+=",debugging=true"}d+='<param name="initParams" value="'+f+'" />';
d+='<param name="minRuntimeVersion" value="4.0.50401.0" />';d+='<param name="autoUpgrade" value="false" />';
d+="</object>";var a=document.getElementById("DiffusionContainer");var e=document.createElement("div");
e.style.position="fixed";e.style.left="0px";e.style.top="0px";e.innerHTML=d;a.appendChild(e);this.timeoutVar=setTimeout(DiffusionClient.bind(this.onTimeout,this),c.cascadeTimeout)
};DiffusionSilverlightTransport.prototype.onTimeout=function(){DiffusionClient.trace("Silverlight Timeout Cascade");
if(!DiffusionClient.diffusionTransport.isReconnecting){this.clearPlugin()}DiffusionClient.diffusionTransport.cascade()
};DiffusionSilverlightTransport.prototype.clearPlugin=function(){try{var a=document.getElementById("DiffusionContainer");
var c=document.getElementById("DiffusionClientSilverlight");if(c!=null){var b=c.parentNode;b.removeChild(c);
a.removeChild(b)}}catch(d){}};DiffusionSilverlightTransport.prototype.onSilverlightConnect=function(b){clearTimeout(this.timeoutVar);
if(b==false){DiffusionClient.trace("Silverlight Connection not successful.");DiffusionClient.diffusionTransport.cascade()
}else{DiffusionClient.trace("Silverlight Connection successful.");var c=b.split("\u0002");DiffusionClient.serverProtocolVersion=c[0];
var a=null;a=document.DiffusionClientSilverlight;if(a==null){a=window.DiffusionClientSilverlight}this.silverlightConnection=a.content.DiffusionJavaScriptClient;
DiffusionClient.diffusionTransport.connected(c[1])}};DiffusionSilverlightTransport.prototype.onSilverlightError=function(c,a){DiffusionClient.trace("Silverlight Connection not successful. (Error)");
var b="";if(c!=null&&c!=0){b=c.getHost().Source}var f=a.ErrorType;var d=a.ErrorCode;if(f=="ImageError"||f=="MediaError"){return
}var e="Unhandled Error in Silverlight Application "+b+"\n";e+="Code: "+d+" Category: "+f+" Message: "+a.ErrorMessage+"\n";
if(f=="ParserError"){e+="File: "+a.xamlFile+" Line: "+a.lineNumber+" Position: "+a.charPosition+"\n"}else{if(f=="RuntimeError"){if(a.lineNumber!=0){e+="Line: "+a.lineNumber+" Position: "+a.charPosition+"\n"
}e+="MethodName: "+a.methodName+"\n"}}DiffusionClient.trace(e)};DiffusionXHRTransport=function(){this.serverUrl=DiffusionClient.connectionDetails.XHRURL+DiffusionClient.connectionDetails.context+"/diffusion/";
this.requests=new Array();this.isSending=false;this.requestListener=null;this.retryCount=0;this.isNativeXmlHttp=false;
this.seq=0;this.aborted=false};DiffusionXHRTransport.prototype.sendTopicMessage=function(c){var b={m:"2",c:DiffusionClient.getClientID(),t:encodeURIComponent(c.getTopic()),s:this.seq++};
if(c.getUserHeaders()!=null){b.u=encodeURIComponent(c.getUserHeaders().join("\u0002"))}if(c.getAckRequired()){b.a=c.getAckID()
}var a=this.createDiffusionRequest(b);a.data=c.getMessage();this.processRequest(a)};DiffusionXHRTransport.prototype.send=function(a,b){var c=this.createDiffusionRequest({m:"2",c:DiffusionClient.getClientID(),t:encodeURIComponent(a),s:this.seq++});
c.data=b;this.processRequest(c)};DiffusionXHRTransport.prototype.XHRSubscription=function(a,b){this.processRequest(this.createDiffusionRequest({m:b,c:DiffusionClient.getClientID(),t:encodeURIComponent(a),s:this.seq++}))
};DiffusionXHRTransport.prototype.subscribe=function(a){this.XHRSubscription(encodeURIComponent(a),"22")
};DiffusionXHRTransport.prototype.unsubscribe=function(a){this.XHRSubscription(encodeURIComponent(a),"23")
};DiffusionXHRTransport.prototype.ping=function(a,b){this.processRequest(this.createDiffusionRequest({m:"24",c:DiffusionClient.getClientID(),u:encodeURIComponent([a,b].join("\u0002")),s:this.seq++}))
};DiffusionXHRTransport.prototype.sendClientPingResponse=function(a){this.processRequest(this.createDiffusionRequest({m:"25",c:DiffusionClient.getClientID(),u:a,s:this.seq++}))
};DiffusionXHRTransport.prototype.sendAckResponse=function(a){this.processRequest(this.createDiffusionRequest({m:"32",c:DiffusionClient.getClientID(),u:a,s:this.seq++}))
};DiffusionXHRTransport.prototype.fetch=function(a,b){var c={m:"33",c:DiffusionClient.getClientID(),t:encodeURIComponent(a),s:this.seq++};
if(b){c.u=b}this.processRequest(this.createDiffusionRequest(c))};DiffusionXHRTransport.prototype.command=function(e,b,d){var c={m:"36",c:DiffusionClient.getClientID(),t:encodeURIComponent(d.getTopic()),s:this.seq++};
c.u=e;if(b!==undefined&&b!==null){c.u+="\u0002"+b}if(d.getUserHeaders()!=null){c.u+="\u0002";c.u+=d.getUserHeaders().join("\u0002")
}if(c.u!=undefined||c.u!=null){c.u=encodeURIComponent(c.u)}if(d.getAckRequired()){c.a=d.getAckID()}var a=this.createDiffusionRequest(c);
a.data=d.getMessage();this.processRequest(a)};DiffusionXHRTransport.prototype.sendCredentials=function(a){this.processRequest(this.createDiffusionRequest({m:"26",c:DiffusionClient.getClientID(),username:encodeURIComponent(a.username),password:encodeURIComponent(a.password),s:this.seq++}))
};DiffusionXHRTransport.prototype.close=function(){if(this.pollRequest){this.aborted=true;this.pollRequest.abort()
}var a=this.createXHRTransport();a.open("POST",this.serverUrl,false);a.setRequestHeader("m","29");a.setRequestHeader("c",DiffusionClient.getClientID());
try{a.send("")}catch(b){}};DiffusionXHRTransport.prototype.poll=function(){if(DiffusionClient.diffusionTransport.isClosing){return
}var b=this;var a=this.createDiffusionRequest({m:"1",c:DiffusionClient.getClientID()}).request;a.onreadystatechange=function(){if(b.aborted){return
}if(a.readyState==4){if(a.status==200){DiffusionClient.diffusionTransport.handleMessages(a.responseText);
b.retryCount=0;b.poll()}else{if(DiffusionClient.diffusionTransport.isClosing!=true){DiffusionClient.diffusionTransport.isClosing=true;
DiffusionClient.diffusionTransport.isConnected=false;this.requests=[];if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction()
}}}}};this.pollRequest=a;a.send("")};DiffusionXHRTransport.prototype.connect=function(a){this.seq=0;if(DiffusionClient.connectionDetails.disableXHR==true){DiffusionClient.diffusionTransport.cascade();
return}if(this.detectXmlHttp()==false){DiffusionClient.diffusionTransport.cascade();return}DiffusionClient.trace("XHR connect");
var e=this;var d={m:"0",ty:"B",t:encodeURIComponent(DiffusionClient.connectionDetails.topic),tt:DiffusionClient.connectionDetails.transportTimeout,v:DiffusionClient.getClientProtocolVersion()};
if(a){d.c=DiffusionClient.getClientID()}var c=DiffusionClient.getCredentials();if(c!=null){d.username=encodeURIComponent(c.username);
d.password=encodeURIComponent(c.password)}var b=this.createDiffusionRequest(d).request;b.onreadystatechange=function(){if(b.readyState==4){if(b.status==200){var g=b.responseText.split("\u0002");
DiffusionClient.serverProtocolVersion=g.shift();var f=g.shift();DiffusionClient.messageLengthSize=g.shift();
if(f=="100"||f=="105"){DiffusionClient.diffusionTransport.connected(g[0]);e.poll()}else{if(f=="111"){DiffusionClient.diffusionTransport.connectionRejected()
}DiffusionClient.diffusionTransport.cascade()}}else{DiffusionClient.diffusionTransport.cascade()}}};b.send("")
};DiffusionXHRTransport.prototype.createXHRTransport=function(){if(this.isNativeXmlHttp){return new XMLHttpRequest()
}else{return new ActiveXObject(this.activeXName)}};DiffusionXHRTransport.prototype.processRequest=function(b){if(b!=null){this.requests.push(b)
}if(this.isSending){return}if(this.requests.length==0){return}var c=this.requests.shift();var a=c.request;
var d=this;a.onreadystatechange=function(){try{if(a.readyState==4){if(a.status==0){DiffusionClient.trace("checkRequest - lost connection");
DiffusionClient.diffusionTransport.isClosing=true;DiffusionClient.diffusionTransport.isConnected=false;
if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction()
}}d.isSending=false;setTimeout(function(){d.processRequest(null)},0)}}catch(f){DiffusionClient.trace("error: processRequest "+f)
}};this.isSending=true;a.send(c.data)};DiffusionXHRTransport.prototype.createDiffusionRequest=function(d){var a=this.createXHRTransport();
a.open("POST",this.serverUrl,true);for(var f in d){try{a.setRequestHeader(f,d[f])}catch(c){DiffusionClient.trace("Can't set header "+f+":"+d.join(":"))
}}var b={data:"",request:a};return b};DiffusionXHRTransport.prototype.detectXmlHttp=function(){var b=null;
try{b=new XMLHttpRequest();DiffusionClient.trace("detectXmlHttp: got native");if(b!=null){this.isNativeXmlHttp=true;
return true}}catch(d){}if(DiffusionClient.isIE){var c=new Array("MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP");
for(var a=0;a<c.length;++a){try{b=new ActiveXObject(c[a])}catch(d){}if(b!=null){this.activeXName=c[a];
DiffusionClient.trace("detectXmlHttp: "+this.activeXName);return true}}}return false};DiffusionIframeTransport=function(){this.container=document.getElementById("DiffusionContainer");
this.requests=new Array();this.pollFrame=null;this.connectFrame=null;this.baseURL=DiffusionClient.connectionDetails.context+"/diffusion/";
this.isSending=false;this.seq=0};DiffusionIframeTransport.prototype.send=function(a,b){this.post("?m=2&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(a)+"&d="+encodeURIComponent(b))
};DiffusionIframeTransport.prototype.sendTopicMessage=function(b){var a="?m=2&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(b.getTopic())+"&d="+encodeURIComponent(b.getMessage());
if(b.getUserHeaders()!=null){a+="&u="+encodeURIComponent(b.getUserHeaders().join("\u0002"))}if(b.getAckRequired()){a+="&a="+b.getAckID()
}this.post(a)};DiffusionIframeTransport.prototype.subscribe=function(a){this.post("?m=22&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(a))
};DiffusionIframeTransport.prototype.unsubscribe=function(a){this.post("?m=23&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(a))
};DiffusionIframeTransport.prototype.ping=function(a,b){this.post("?m=24&c="+DiffusionClient.getClientID()+"&u="+encodeURIComponent(a+"\u0002"+b))
};DiffusionIframeTransport.prototype.sendAckResponse=function(a){this.post("?m=32&c="+DiffusionClient.getClientID()+"&u="+a)
};DiffusionIframeTransport.prototype.sendCredentials=function(a){this.post("?m=26&c="+DiffusionClient.getClientID()+"&username="+encodeURIComponent(a.username)+"&password="+encodeURIComponent(a.password))
};DiffusionIframeTransport.prototype.fetch=function(a,b){if(b){this.post("?m=33&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(a)+"&u"+b)
}else{this.post("?m=33&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(a))}};DiffusionIframeTransport.prototype.command=function(d,b,c){var a="?m=36&c="+DiffusionClient.getClientID()+"&t="+encodeURIComponent(c.getTopic())+"&d="+encodeURIComponent(c.getMessage());
a+="&u="+d;if(b!==undefined&&b!==null){a+=encodeURIComponent("\u0002"+b)}if(c.getUserHeaders()!=null){a+=encodeURIComponent("\u0002"+c.getUserHeaders().join("\u0002"))
}if(c.getAckRequired()){a+="&a="+c.getAckID()}this.post(a)};DiffusionIframeTransport.prototype.close=function(){if(this.connectFrame!=null){var a=this.baseURL+"?m=29&c="+DiffusionClient.getClientID();
DiffusionClient.trace("close : "+a);if(DiffusionClient.isIE){this.connectFrame.src=a}else{this.connectFrame.contentDocument.location.replace(a)
}this.container.removeChild(this.pollFrame);this.pollFrame=null;this.container.removeChild(this.connectFrame);
this.connectFrame=null}};DiffusionIframeTransport.prototype.sendClientPingResponse=function(a){this.post("?m=25&c="+DiffusionClient.getClientID()+"&u="+a)
};DiffusionIframeTransport.prototype.connect=function(a){this.seq=0;var c=DiffusionClient.connectionDetails;
if(c.disableIframe){DiffusionClient.diffusionTransport.cascade();return}var b=this.baseURL+"?m=0&ty=B&t="+encodeURIComponent(c.topic)+"&tt="+c.transportTimeout+"&v="+DiffusionClient.getClientProtocolVersion();
if(a){b+="&c="+DiffusionClient.getClientID()}if(DiffusionClient.credentials!=null){b+="&username="+encodeURIComponent(DiffusionClient.credentials.username)+"&password="+encodeURIComponent(DiffusionClient.credentials.password)
}this.connectFrame=this.createFrame("DIT",b,false);setTimeout(function(){if(DiffusionClient.diffusionTransport.isConnected==false){DiffusionClient.diffusionTransport.cascade()
}},500)};DiffusionIframeTransport.prototype.poll=function(){if(DiffusionClient.diffusionTransport.isClosing){return
}var a=this.baseURL+"?m=1&c="+DiffusionClient.getClientID()+"&nc="+new Date().valueOf();this.pollFrame=this.createFrame("DITP",a,true)
};DiffusionIframeTransport.prototype.createFrame=function(c,a,j){try{var d=document.getElementById(c);
if(d){this.container.removeChild(d)}}catch(g){}var f;var h={id:c,name:c,src:a},l=["onload","onerror","onunload"],k=DiffusionClient.diffusionTransport.transport.process;
try{f=document.createElement('<iframe id="'+h.id+'" name="'+h.id+'" src="'+h.src+'">')}catch(g){f=document.createElement("iframe");
for(var b in h){f[b]=h[b]}}f.style.width="0px";f.style.height="0px";f.style.border="none";if(j){if(f.attachEvent){while(l.length){f.attachEvent(l.pop(),k)
}}else{while(l.length){f[l.pop()]=k}}}this.container.appendChild(f);return f};DiffusionIframeTransport.prototype.post=function(a){this.requests.push(a);
if(this.isSending==false){this.isSending=true;_this=this;setTimeout(function(){_this.processRequest()
},80)}};DiffusionIframeTransport.prototype.processRequest=function(){if(this.requests.length>0){var a=this.baseURL+this.requests.shift()+"&s="+this.seq++;
if(this.connectFrame!=null){if(DiffusionClient.isIE){this.connectFrame.src=a}else{if(this.connectFrame.contentDocument){this.connectFrame.contentDocument.location.replace(a)
}}}}if(this.requests.length>0){_this=this;setTimeout(function(){_this.processRequest()},80)}else{this.isSending=false
}};DiffusionIframeTransport.prototype.process=function(){try{var c=DiffusionClient.diffusionTransport.transport.pollFrame;
if(c){var a=c.contentWindow?c.contentWindow.document:c.contentDocument?c.contentDocument:c.document;if(a!==undefined&&a.getElementsByTagName("script").length>0){return DiffusionClient.diffusionTransport.transport.poll()
}}}catch(b){DiffusionClient.trace("Error: Diffusion iFrame Transport: process "+b)}if(DiffusionClient.diffusionTransport.isClosing!=true){DiffusionClient.diffusionTransport.isClosing=true;
DiffusionClient.diffusionTransport.isConnected=false;if(typeof DiffusionClient.connectionDetails.onLostConnectionFunction=="function"){DiffusionClient.connectionDetails.onLostConnectionFunction()
}}};DiffusionClientConnectionDetails=function(){this.debug=false;this.libPath="/lib/DIFFUSION";this.context="";
this.cascadeTimeout=4000;this.flashHost=window.location.hostname;this.flashPort=((window.location.port==0)?80:window.location.port);
this.flashURL=location.protocol+"//"+location.host;this.flashTransport="S";this.flashTimeout=3000;this.disableFlash=false;
this.silverlightHost=window.location.hostname;this.silverlightPort=4503;this.silverlightURL=location.protocol+"//"+location.host;
this.silverlightTransport="S";this.disableSilverlight=false;this.XHRURL=location.protocol+"//"+location.host;
this.XHRretryCount=3;this.timeoutMS=4000;this.transportTimeout=90;this.disableXHR=false;this.wsURL="ws";
if(location.protocol=="https:"){this.wsURL+="s"}this.wsURL+="://"+location.host;this.wsTimeout=2000;this.disableWS=false;
this.disableIframe=false;this.topic=null;this.autoAck=true;this.onDataFunction=null;this.onBeforeUnloadFunction=null;
this.onCallbackFunction=null;this.onInvalidClientFunction=null;this.onCascadeFunction=null;this.onPingFunction=null;
this.onAbortFunction=null;this.onLostConnectionFunction=null;this.onConnectionRejectFunction=null;this.onMessageNotAcknowledgedFunction=null;
this.onServerRejectedCredentialsFunction=null;this.onTopicStatusFunction=null};DiffusionRecord=function(){this.fields=[];
DiffusionRecord.prototype.addFields.apply(this,arguments)};DiffusionRecord.prototype.fieldDelimiter="\u0002";
DiffusionRecord.prototype.recordDelimiter="\u0001";DiffusionRecord.prototype.setField=function(a,b){if(this.fields[a]){this.fields[a]=b
}};DiffusionRecord.prototype.addField=function(a,b){if(a>=this.fields.length){this.fields.push(b)}else{this.fields.splice(a,0,b)
}};DiffusionRecord.prototype.addFields=function(d){if(d){var a=typeof d==="string"?arguments:d;var c=a.length,b=0;
for(;b<c;++b){this.fields.push(a[b])}}};DiffusionRecord.prototype.removeField=function(a){this.fields.splice(a,1)
};DiffusionRecord.prototype.getField=function(a){return this.fields[a]};DiffusionRecord.prototype.getFields=function(){return this.fields.concat()
};DiffusionRecord.prototype.toString=function(){return this.fields.join(this.fieldDelimiter)};DiffusionRecord.prototype.size=function(){return this.fields.length
};WebClientMessage=function(b,a){this.messageCount=a;this.messageType=b.charCodeAt(0);this.timeStamp=new Date();
this.ackID=null;this.needsAcknowledge=false;this.records=[];this.headers=[];this.fieldslength=0;this.fieldPointer=0;
this.recordPointer=0;this.recordFieldPointer=0;this.header="";this.message="";this.payload=b;this.parseResponse(b);
this.recordlength=this.records.length;this.headerlength=this.headers.length;this.topic=this.headers.shift().slice(1);
if(this.messageType==30||this.messageType==31){this.ackID=this.headers.shift();this.needsAcknowledge=true
}};WebClientMessage.prototype.displayFormatRecordRegex=new RegExp(DiffusionRecord.prototype.recordDelimiter,"g");
WebClientMessage.prototype.displayFormatFieldRegex=new RegExp(DiffusionRecord.prototype.fieldDelimiter,"g");
WebClientMessage.prototype.getHeader=function(){return this.header};WebClientMessage.prototype.getBody=function(){return this.payload.substr((this.getHeader().length+1))
};WebClientMessage.prototype.isInitialTopicLoad=function(){return(this.messageType==20||this.messageType==30)
};WebClientMessage.prototype.isFetchMessage=function(){return(this.messageType==34)};WebClientMessage.prototype.isDeltaMessage=function(){return(this.messageType==21||this.messageType==31)
};WebClientMessage.prototype.getTopic=function(){return this.topic};WebClientMessage.prototype.setTopic=function(a){this.topic=a
};WebClientMessage.prototype.getNumberOfRecords=function(){return this.records.length};WebClientMessage.prototype.getFields=function(a){if(this.records[a]){return this.records[a].getFields()
}};WebClientMessage.prototype.getRecord=function(a){return this.records[a]};WebClientMessage.prototype.getRecords=function(){return this.records.concat()
};WebClientMessage.prototype.hasRemaining=function(){return this.fieldslength>this.fieldPointer};WebClientMessage.prototype.nextField=function(){while(this.records[this.recordPointer]&&this.records[this.recordPointer].size()<=this.recordFieldPointer){this.recordPointer++;
this.recordFieldPointer=0}if(this.records[this.recordPointer]){this.fieldPointer++;return this.records[this.recordPointer].getField(this.recordFieldPointer++)
}};WebClientMessage.prototype.nextRecord=function(){if(this.recordlength>this.recordPointer){this.fieldPointer+=(this.records[this.recordPointer].size()-this.recordFieldPointer);
this.recordFieldPointer=0;return this.records[this.recordPointer++]}};WebClientMessage.prototype.rewind=function(){this.fieldPointer=this.recordPointer=this.recordFieldPointer=0
};WebClientMessage.prototype.getJSONObject=function(){var jsonString=this.records[0].getField(0);if(window.JSON&&typeof window.JSON.parse==="function"){return JSON.parse(jsonString)
}else{return eval("("+jsonString+")")}};WebClientMessage.prototype.getTimestampAsDate=function(){return this.timeStamp
};WebClientMessage.prototype.localeTimeString=function(){return this.timeStamp.toLocaleTimeString()};
WebClientMessage.prototype.getMessageCount=function(){return this.messageCount};WebClientMessage.prototype.getUserHeaders=function(){return this.headers
};WebClientMessage.prototype.getUserHeader=function(a){return this.headers[a]};WebClientMessage.prototype.getBaseTopic=function(){return this.topic.substr((this.topic.lastIndexOf("/")+1),this.topic.length)
};WebClientMessage.prototype.isAckMessage=function(){return(this.messageType==30||this.messageType==31)
};WebClientMessage.prototype.getAckID=function(){return this.ackID};WebClientMessage.prototype.setAcknowledged=function(){this.needsAcknowledge=false
};WebClientMessage.prototype.needsAcknowledgement=function(){return this.needsAcknowledge};WebClientMessage.prototype.displayFormat=function(){var a="";
if(this.headerslength>0){a="["+this.headers.join("|")+"]"}a+=this.getBody().replace(this.displayFormatRecordRegex,"<RD>");
a=a.replace(this.displayFormatFieldRegex,"<FD>");return a};WebClientMessage.prototype.parseResponse=function(b){var e=b.split(DiffusionRecord.prototype.recordDelimiter),d=e.length,c=0;
for(;c<d;++c){var a=e[c].split(DiffusionRecord.prototype.fieldDelimiter);if(c===0){this.header=e[c];this.headers=a
}else{this.fieldslength+=a.length;this.records.push(new DiffusionRecord(a))}}};TopicMessage=function(a,b){this.topic=a;
this.isCrypted=false;this.userHeaders=null;this.isAckRequested=false;this.ackTimeout=0;this.records=[];
this.parseMessage(b);this.message=b};TopicMessage.prototype.getMessage=function(){return this.asString()
};TopicMessage.prototype.setMessage=function(a){this.put(a)};TopicMessage.prototype.put=function(a){this.parseMessage(a)
};TopicMessage.prototype.putFields=function(b){if(b){if(!this.records.length){this.records.push(new DiffusionRecord())
}var a=typeof b==="string"?arguments:b;this.records[this.records.length-1].addFields(a)}};TopicMessage.prototype.putRecord=function(b){if(b){var a=typeof b==="string"?arguments:b;
this.records.push(new DiffusionRecord(a))}};TopicMessage.prototype.putRecords=function(a){if(a){var b=a instanceof DiffusionRecord?arguments:a;
var c=0,d=b.length;for(;c<d;++c){this.records.push(b[c])}}};TopicMessage.prototype.asRecords=function(){return this.records
};TopicMessage.prototype.asFields=function(){var a=[],c=this.records.length,b=0;for(;b<c;++b){a.push.apply(a,this.records[b].getFields())
}return a};TopicMessage.prototype.asString=function(){return this.records.join(DiffusionRecord.prototype.recordDelimiter)
};TopicMessage.prototype.displayFormat=function(){return this.asString().replace(this.displayFormatRecordRegex,"<RD>").replace(this.displayFormatFieldRegex,"<FD>")
};TopicMessage.prototype.displayFormatRecordRegex=new RegExp(DiffusionRecord.prototype.recordDelimiter,"g");
TopicMessage.prototype.displayFormatFieldRegex=new RegExp(DiffusionRecord.prototype.fieldDelimiter,"g");
TopicMessage.prototype.parseMessage=function(d){if(d){var e=d.split(DiffusionRecord.prototype.recordDelimiter),c=e.length,b=0;
for(;b<c;++b){var a=e[b].split(DiffusionRecord.prototype.fieldDelimiter);this.records.push(new DiffusionRecord(a))
}}};TopicMessage.prototype.getTopic=function(){return this.topic};TopicMessage.prototype.setUserHeaders=function(a){this.userHeaders=a
};TopicMessage.prototype.getUserHeaders=function(){return this.userHeaders};TopicMessage.prototype.addUserHeader=function(a){if(this.userHeaders==null){this.userHeaders=[]
}this.userHeaders.push(a)};TopicMessage.prototype.setCrypted=function(a){this.isCrypted=a};TopicMessage.prototype.getCrytped=function(){return this.isCrypted
};TopicMessage.prototype.getAckRequired=function(){return this.isAckRequested};TopicMessage.prototype.setAckRequired=function(a){this.isAckRequested=true;
this.ackTimeout=a;this.ackID=DiffusionClient.diffusionTransport.getNextAckID();return this.ackID};TopicMessage.prototype.getAckID=function(){return this.ackID
};TopicMessage.prototype.getAckTimeout=function(){return this.ackTimeout};TopicMessage.prototype.setAckTimeout=function(a){this.ackTimeout=a
};TopicMessage.prototype.toRecord=function(){var b="\u0003";var a=this.topic+b+this.asString()+b+this.isCrypted+b+this.isAckRequested;
if(this.isAckRequested){a+=b+this.ackID}if(this.userHeaders!=null){a+=b+this.userHeaders.join(b)}return a
};PingMessage=function(a){var b=a.split("\u0002");this.timestamp=b[0].substr(1,b[0].length);this.queueSize=b[1].substr(0,(b[1].length-1))
};PingMessage.prototype.getTimestamp=function(){return this.timestamp};PingMessage.prototype.getQueueSize=function(){return this.queueSize
};PingMessage.prototype.getTimeSinceCreation=function(){return(new Date().getTime()-new Number(this.timestamp))
};DiffusionClientCredentials=function(){this.username="";this.password="";this.toRecord=function(){return this.username+"\u0002"+this.password
}};DiffusionAckProcess=function(a){DiffusionClient.trace("DiffusionAckProcess "+a.getAckID());this.topicMessage=a;
var b=this;this.timeout=setTimeout(function(){b.onTimeout(b)},a.getAckTimeout())};DiffusionAckProcess.prototype.cancel=function(){DiffusionClient.trace("DiffusionAckProcess: cancel "+this.topicMessage.getAckID());
clearTimeout(this.timeout)};DiffusionAckProcess.prototype.onTimeout=function(a){DiffusionClient.trace("DiffusionAckProcess: onTimeout "+this.topicMessage.getAckID());
try{DiffusionClient.connectionDetails.onMessageNotAcknowledgedFunction(this.topicMessage)}catch(b){DiffusionClient.trace("DiffusionAckProcess: unable to call onMessageNotAcknowledged "+b)
}};TopicStatusMessage=function(b,c,a){this.topic=b;this.alias=c;this.status=a};TopicStatusMessage.prototype.getTopic=function(){return this.topic
};TopicStatusMessage.prototype.getAlias=function(){return this.alias};TopicStatusMessage.prototype.getStatus=function(){return this.status
};FragmentedMessage=function(a){this.payload=a;this.messageType=a.charCodeAt(0);this.rows=a.split("\u0001");
this.headers=this.rows[0].split("\u0002");var b=this.headers.shift();this.topic=b.substr(1,b.length);
this.baseType=null;this.fragmentedType=this.messageType;this.baseType=this.messageType&~64;this.correlationId=this.headers[0];
this.totalSize=null;var c=this.headers[1].split("/");this.partNumber=c[0];this.totalParts=c[1];if(this.totalParts!=null){this.totalSize=this.headers[2]
}};FragmentedMessage.prototype.getCorrelationId=function(){return this.correlationId};FragmentedMessage.prototype.getHeader=function(){return this.rows[0]
};FragmentedMessage.prototype.getHeaders=function(){return this.headers};FragmentedMessage.prototype.getBody=function(){return this.payload.substr((this.getHeader().length+1))
};FragmentedMessage.prototype.getBaseType=function(){return this.baseType};FragmentedMessage.prototype.getPartNumber=function(){return this.partNumber
};FragmentedMessage.prototype.getTotalParts=function(){return this.totalParts};FragmentedMessage.prototype.process=function(){if(DiffusionClient.fragmentMap[this.correlationId]===undefined){DiffusionClient.fragmentMap[this.correlationId]={}
}DiffusionClient.fragmentMap[this.correlationId][this.partNumber]=this;var j=DiffusionClient.fragmentMap[this.correlationId];
var c=DiffusionClient.fragmentMap[this.correlationId]["1"];if(c===undefined){return null}var g=0;for(var k in j){g++
}if(g<c.getTotalParts()){return null}var a="";for(var b=3;b<c.getHeaders().length;b++){if(b>3){a=a+"\u0002"
}a=a+c.getHeaders()[b]}var d="";for(var e in j){d=d+j[e].getBody()}var h=String.fromCharCode(this.baseType)+this.topic+"\u0002"+a+"\u0001"+d;
return h};CommandMessage=function(b,a){WebClientMessage.call(this,b,a);if(this.isInitialTopicLoad()){this.category=this.headers.shift();
this.topicType=this.headers.shift();this.notificationType=undefined}else{this.category=undefined;this.topicType=undefined;
this.notificationType=this.headers.shift()}};for(var i in WebClientMessage.prototype){CommandMessage.prototype[i]=WebClientMessage.prototype[i]
}CommandMessage.prototype.isInitialTopicLoad=function(){return(this.messageType==40)};CommandMessage.prototype.isDeltaMessage=function(){return(this.messageType==41)
};CommandMessage.prototype.getCategory=function(){return this.category};CommandMessage.prototype.getTopicType=function(){return this.topicType
};CommandMessage.prototype.getNotificationType=function(){return this.notificationType};CommandMessage.prototype.SERVICE_CATEGORY=0;
CommandMessage.prototype.PAGED_CATEGORY=1;TopicListener=function(b,d,c,a){this.regex=new RegExp(b);this.fp=d;
this.context=a;this.handle=c};TopicListener.prototype.getHandle=function(){return this.handle};TopicListener.prototype.getRegex=function(){return this.regex
};TopicListener.prototype.callFunction=function(a){try{if(this.fp.apply(this.context,[a])==true){return true
}}catch(b){DiffusionClient.trace("Problem with TopicListener "+this.handle+" : "+b)}return false};TimedTopicListener=function(b,f,d,e,c,a){this.regex=new RegExp(b);
this.fp=f;this.handle=d;this.time=e;this.force=c;this.context=a;this.time=e;this.messagesList=new Array();
this.timer=setInterval((function(g){return function(){g.onTimerEvent()}})(this),e)};TimedTopicListener.prototype.getRegex=function(){return this.regex
};TimedTopicListener.prototype.getHandle=function(){return this.handle};TimedTopicListener.prototype.stop=function(){clearInterval(this.timer)
};TimedTopicListener.prototype.callFunction=function(a){this.messagesList.push(a);return false};TimedTopicListener.prototype.onTimerEvent=function(){if((this.force)||(this.messagesList.length>0)){try{var a=this.messagesList.concat();
this.messagesList.length=0;this.fp.apply(this.context,[a])}catch(b){DiffusionClient.trace("Problem with TimedTopicListener:onTimerEvent: "+b)
}}};