/**************************************************/
/***************       SCRIPT       ***************/
/**************************************************/

conn = new Mongo();
db = conn.getDB("finance");

print("Inserting bank accounts....")

db.bankAccounts.insert([ 
	{ name: "Conta Conjunta Principal", bankName: "Montepio Geral", iban: "PT50003601609910008123858" },
	 { name: "Antiga conta", bankName: "Caixa Geral de Depósitos", iban: "PT500036012039310001828382" } 
]);

db.logout()

print("FINISHED!")