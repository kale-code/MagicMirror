var MMSocket = function(moduleName) {
	var self = this;

	if (typeof moduleName !== "string") {
		throw new Error("Please set the module name for the MMSocket.");
	}

	self.moduleName = moduleName;

	// Private Methods
	self.socket = io("/" + self.moduleName);
	var notificationCallback = () => {};

	var onevent = self.socket.onevent;
	self.socket.onevent = function(packet) {
		var args = packet.data || [];
		onevent.call(this, packet);    // original call
		packet.data = ["*"].concat(args);
		onevent.call(this, packet);      // additional call to catch-all
	};

	// register catch all.
	self.socket.on("*", (notification, payload) => {
		if (notification !== "*") {
			notificationCallback(notification, payload);
		}
	});

	// Public Methods
	this.setNotificationCallback = callback => {
		notificationCallback = callback;
	};

	this.sendNotification = (notification, payload) => {
		if (typeof payload === "undefined") {
			payload = {};
		}
		self.socket.emit(notification, payload);
	};
};
