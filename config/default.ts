export default {
	port: process.env.PORT || 3050,
	log_level: process.env.LOG_LEVEL || "info",
	mongo_url: process.env.MONGO_URL,
};
