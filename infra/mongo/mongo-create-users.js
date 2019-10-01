conn = new Mongo();
db = conn.getDB("admin");

db.adminCommand(
	{
		createUser: "admin",
		pwd: "admin",  // or passwordPrompt()
		roles: [
			{ role: "dbOwner", db: "admin" },
			{ role: "root", db: "admin" }
		]
	}
)

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

db = conn.getDB("admin");
db.adminCommand( { shutdown: 1, force: true } )