conn = new Mongo();

db = conn.getDB("finance");

db.createUser({
	user: "finance-admin",
	pwd: "finance-admin",  // Or  "passwordPrompt()"
	roles: ["dbOwner"]
})

db.createUser({
	user: "finance-user",
	pwd: "finance-user",  // Or  "passwordPrompt()"
	roles: ["readWrite"]
})

db.logout()