//
//  ViewController.swift
//  BlogExample
//
//  Created by Martin Cowie on 10/06/2014.
//  Copyright (c) 2014 Push Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController, DFClientDelegate {
                            
	@IBOutlet var connectionsLabel : UILabel
	@IBOutlet var loadAvgLabel : UILabel
	
	let loadAvgTopic = "Diffusion/MBeans/java/lang/type=OperatingSystem/Attributes/SystemLoadAverage";
	let clientCountTopic = "Diffusion/Metrics/server/clients/concurrent"
	let serverURL = NSURL(string: "dpt://demo.pushtechnology.com:80")
	
	var dfClient: DFClient?
	
	override func viewDidLoad() {
		super.viewDidLoad()
		
		var serverDetails :DFServerDetails = DFServerDetails(
			URL: serverURL,
			error: nil)
		
		var client  = DFClient();
		client.connectionDetails = DFConnectionDetails(
			server: serverDetails,
			topics: "\(loadAvgTopic),\(clientCountTopic)",
			andCredentials: nil)
		client.delegate = self;
		client.connect()
		dfClient = client; // W/O this, the client object is GC'd
	}
	
	// === DFClientDelegate Obligations ===
	
	func onConnection( isConnected :Bool ) -> Void {
		println( "Connected=" + isConnected.description )
	}
	
	func onLostConnection() {
		println( "Lost Connection" )
	}
	
	func onMessage(message :DFTopicMessage) {
		
		switch( message.topic) {
			case clientCountTopic:
				connectionsLabel.text = message.asString

			case loadAvgTopic:
				loadAvgLabel.text = message.asString
				
			default:
				println( "onMessage(" + message.description + ")" );
		}
	}
	
	func onAbort() { }
	
	func onPing(message :DFPingMessage) { }
	
	func onServerRejectedConnection() { }
	
	func onMessageNotAcknowledged( message :DFTopicMessage ) { }
	
	func onConnectionSequenceExhausted( client :DFClient ) { }

}

