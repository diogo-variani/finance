/**************************************************/
/***************       SCRIPT       ***************/
/**************************************************/

conn = new Mongo();
db = conn.getDB("finance");

var bulk = db.creditCards.initializeOrderedBulkOp();

print("Inserting credit cards....")

db.creditCards.insert([ 
	{ name: "Cartão Principal", issuer: "Mastercard", number: "4510 6459 8301 6543" },
	{ name: "Cartão Milhas", issuer: "Visa", number: "5019 5516 6777 6959"  }
]);


db.logout()