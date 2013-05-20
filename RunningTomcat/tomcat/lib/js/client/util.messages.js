NS( "diffusion.util.message.types", {
	snapshot 		: 20,	// Snapshot 
	delta 			: 21,	// Delta
	subscribe 		: 22,	// Subscribe
	unsubscribe 	: 23,	// Unsubscribe
	pingserver		: 24,	// Ping Server
	pingclient 		: 25,	// Ping Client
	credentials 	: 26,	// Credentials
	rejected		: 27,	// Credentials Rejected
	abort			: 28,	// Abort
	close			: 29,	// Close
	snapshotack		: 30,	// Topic Load - Ack Required
	deltaack		: 31,	// Delta - Ack Required
	ack				: 32,	// Ack
	fetch			: 33,	// Fetch
	fetchreply		: 34,	// Fetch Reply
	topicstat		: 35,	// Topic Status
	command			: 36,	// Command
	commandsnap		: 40,	// Command Topic Load
	commanddelta	: 41,	// Command Topic Notification
	fragcancel		: 42,	// Cancel Fragmented Message
	fragsnapshot	: 84,	// Topic Load Fragmented
	fragdelta		: 85,	// Delta Fragmented
	fragfetchreply	: 98	// Fetch Reply Fragmented
});

NS( "diffusion.util.message.names", {
	20 : 'Snap', 		// Snapshot 
	21 : 'Delta', 		// Delta
	22 : 'Sub', 		// Subscribe
	23 : 'Unsub', 		// Unsubscribe
	24 : 'PingS', 		// Ping Server
	25 : 'PingC', 		// Ping Client
	26 : 'Cred', 		// Credentails
	27 : 'BadCred', 	// Credentials Rejected
	28 : 'Abort', 		// Abort
	29 : 'Close', 		// Close
	30 : 'SnapAck', 	// Topic Load - Ack Required
	31 : 'DeltaAck', 	// Delta - Ack Required
	32 : 'Ack', 		// Ack
	33 : 'Fetch', 		// Fetch
	34 : 'FetchRep', 	// Fetch Reply
	35 : 'TopicStat', 	// Topic Status
	36 : 'Cmd', 		// Command
	40 : 'CmdSnap', 	// Command Topic Load
	41 : 'CmdDelta', 	// Command Topic Notification
	42 : 'FragCncl', 	// Cancel Fragmented Message
	84 : 'FragSnap', 	// Topic Load Fragmented
	85 : 'FragDelta', 	// Delta Fragmented
	98 : 'FragFetchRep' // Fetch Reply Fragmented
});