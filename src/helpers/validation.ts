const validationSendMessage = (req: any = {}, callback: any) => {
	if (req.phone == "" && req.message == "") {
		return callback("Phone dan Message tidak boleh kosong", null);
	} else if (!req.phone && !req.message) {
		return callback("Maaf, Field phone dan message tidak boleh kosong", null);
	} else if (isNaN(req.phone)) {
		return callback("Maaf, Field phone harus berupa angka", null);
	} else if (req.phone.length < 11) {
		return callback("Maaf, Field phone minimal 11 angka", null);
	} else {
		const response = {
			phone: req.phone,
			message: req.message,
			media: req.media,
		};

		return callback(null, response);
	}
};

export { validationSendMessage };
