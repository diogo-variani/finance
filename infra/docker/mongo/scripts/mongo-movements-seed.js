/**************************************************/
/*********       UTILITY FUNCTIONS        *********/
/**************************************************/

function loadCategories(){
	const categoriesCursor = db.categories.find();
	const categories = categoriesCursor.toArray();
	return categories;
}

function loadBankAccounts(){
	const bankAccountsCursor = db.bankAccounts.find();
	const bankAccounts = bankAccountsCursor.toArray();
	return bankAccounts;
}

function loadCreditCards(){
	const creditCardsCursor = db.creditCards.find();
	const creditCards = creditCardsCursor.toArray();
	return creditCards;
}

function createMovement( movements, categories, bankAccounts, creditCards ){

	print("----------------------------------");
	print("Inserting movements...");
	
	var bulk = db.movements.initializeUnorderedBulkOp();
	
	movements.forEach( movement => {		
		
		print( tojson( movement ) );

		if( movement.category ){
			const category = categories.filter( category => category.title === movement.category ).shift();
			if( category ){
				movement.categoryId = category._id;
				delete movement.category;
			}else{
				throw `The category ${movement.category} doesn't exist!`;
			}
		}

		if( movement.bankAccount ){
			const bankAccount = bankAccounts.filter( bankAccount => bankAccount.name === movement.bankAccount ).shift();
			if( bankAccount ){
				movement.bankAccountId = bankAccount._id;
				delete movement.bankAccount;
			}else{
				throw `The bank account ${movement.bankAccount} doesn't exist!`;
			}
		}

		if( movement.creditCard ){
			const creditCard = creditCards.filter( creditCard => creditCard.name === movement.creditCard ).shift();
			if( creditCard ){
				movement.creditCardId = creditCard._id;
				delete movement.creditCard;
			}else{
				throw `The credit card ${movement.creditCard} doesn't exist!`;
			}
		}
		
		bulk.insert( movement );
	});

	bulk.execute( );

	print("Movements inserted successfully!");
}


/**************************************************/
/***************       SCRIPT       ***************/
/**************************************************/

conn = new Mongo();
db = conn.getDB("finance");

print("Loading all categories...")
const categories = loadCategories();

print("Loading all bank accounts...")
const bankAccounts = loadBankAccounts();

print("Loading all credit cards...")
const creditCards = loadCreditCards();

createMovement(
	[
		{purchaseDate:new Date("2017-08-01"), paymentDate:new Date("2017-08-01"), category:"Maquiagem", store:"COMPRA PARFOIS", value:11.97, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-01"), paymentDate:new Date("2017-08-01"), category:"Restaurante", store:"COMPRA BURGER KING", value:3.90, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-01"), paymentDate:new Date("2017-08-01"), category:"Restaurante", store:"COMPRA VITAMINAS CAMP", value:9.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-01"), paymentDate:new Date("2017-08-01"), category:"Restaurante", store:"COMPRA CAMPO PEQUENO", value:3.40, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-01"), paymentDate:new Date("2017-08-01"), category:"Remédios", store:"COMPRA FARMACIA DOURO", value:5.65, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-02"), paymentDate:new Date("2017-08-02"), category:"Salão", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-02"), paymentDate:new Date("2017-08-02"), category:"Brinquedos", store:"COMPRA TOYS R US PO", value:7.33, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-02"), paymentDate:new Date("2017-08-02"), category:"Remédios", store:"COMPRA WELLS SAUDE", value:29.58, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-02"), paymentDate:new Date("2017-08-02"), category:"Supermercado", store:"COMPRA CONTINENTE", value:176.54, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-03"), paymentDate:new Date("2017-08-03"), category:"Luz / Gás", store:"EDP", value:50.86, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-03"), paymentDate:new Date("2017-08-03"), category:"Bolso", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-01"), category:"Uber", store:"COMPRA UBER TRIP UBHJ", value:7.94, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-01"), category:"Netflix", store:"COMPRA NETFLIX COM", value:11.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-04"), category:"Salão", store:"LEVANTAMENTO Confecco", value:30.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-04"), category:"Diversos", store:"COMPRA BANCO DE PORTU", value:3.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-04"), category:"Poupança", store:"TRF CXDAPP", value:15.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-04"), category:"Restaurante", store:"COMPRA PRIORISURPRISE", value:8.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-04"), paymentDate:new Date("2017-08-04"), category:"Restaurante", store:"COMPRA PRIORISURPRISE", value:1.40, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-06"), paymentDate:new Date("2017-08-06"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-06"), paymentDate:new Date("2017-08-06"), category:"Médico", store:"COMPRA HOSPITAL DA LU", value:40.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-06"), paymentDate:new Date("2017-08-06"), category:"Remédios", store:"COMPRA FARMACIA HOLON", value:9.97, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-07"), paymentDate:new Date("2017-08-07"), category:"Restaurante", store:"COMPRA MCDONALD S COL", value:1.70, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-07"), paymentDate:new Date("2017-08-07"), category:"Restaurante", store:"COMPRA MCDONALD S COL", value:2.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Salário", store:"TRF Caixadireta Emp", value:200.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Supermercado", store:"COMPRA MINIPRECO", value:30.59, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Diversos", store:"COMPRA PARTILHAR FANT", value:22.65, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Supermercado", store:"COMPRA CONTINENTE", value:1.11, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Restaurante", store:"COMPRA MCDONALD S COL", value:3.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Restaurante", store:"COMPRA H3 COLOMBO", value:7.85, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-08"), paymentDate:new Date("2017-08-08"), category:"Restaurante", store:"COMPRA AMOR AOS PEDAC", value:40.38, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-09"), paymentDate:new Date("2017-08-07"), category:"Roupas", store:"COMPRAS C DEB PRIMARK", value:22.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-09"), paymentDate:new Date("2017-08-09"), category:"Água", store:"EPAL SA", value:23.67, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-09"), paymentDate:new Date("2017-08-09"), category:"Restaurante", store:"COMPRA CASA DO LAGO", value:6.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-09"), paymentDate:new Date("2017-08-09"), category:"Manutenção", store:"COM MANUTENCAO CONTA", value:5.15, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-08"), category:"Roupas", store:"COMPRAS C DEB PRIMARK", value:2.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-07"), category:"Uber", store:"COMPRA UBER TRIP CFG4", value:4.65, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Metro / Ônibus", store:"COMPRA ESTACAO ENTREC", value:1.45, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Médico", store:"COMPRA CUF DESCOBERTA", value:15.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Restaurante", store:"COMPRA BURGER KING VA", value:4.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Restaurante", store:"COMPRA GO NATURAL", value:7.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Restaurante", store:"COMPRA AMORINO VASCO", value:6.10, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:7.55, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-10"), paymentDate:new Date("2017-08-10"), category:"Médico", store:"COMPRA WE CARE SALDA", value:30.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-08"), category:"Uber", store:"COMPRA UBER BV", value:5.45, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-11"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-11"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-11"), category:"Restaurante", store:"COMPRA ITALIA PASSION", value:24.70, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-11"), category:"Cinema", store:"COMPRA CINEMA ALVALAD", value:19.30, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-11"), category:"Supermercado", store:"COMPRA PINGO DOCE", value:3.92, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-11"), paymentDate:new Date("2017-08-11"), category:"Supermercado", store:"LEVANTAMENTO Av Rainh", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-13"), paymentDate:new Date("2017-08-13"), category:"Presentes", store:"COMPRA H M", value:16.98, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-13"), paymentDate:new Date("2017-08-13"), category:"Supermercado", store:"COMPRA MINIPRECO", value:5.86, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-16"), paymentDate:new Date("2017-08-16"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-17"), paymentDate:new Date("2017-08-17"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-17"), paymentDate:new Date("2017-08-17"), category:"Restaurante", store:"COMPRA TELEPIZZA 35", value:9.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-17"), paymentDate:new Date("2017-08-17"), category:"Supermercado", store:"COMPRA MINIPRECO", value:31.98, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-19"), paymentDate:new Date("2017-08-19"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:24.49, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-20"), paymentDate:new Date("2017-08-20"), category:"Supermercado", store:"COMPRA MINIPRECO", value:4.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-21"), paymentDate:new Date("2017-08-18"), category:"Uber", store:"COMPRA UBER TRIP 57DG", value:7.33, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-22"), paymentDate:new Date("2017-08-22"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-22"), paymentDate:new Date("2017-08-22"), category:"Médico", store:"COMPRA CUF DESCOBERTA", value:15.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-22"), paymentDate:new Date("2017-08-22"), category:"Roupas", store:"COMPRA SPORT ZONE", value:3.49, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-22"), paymentDate:new Date("2017-08-22"), category:"Diversos", store:"COMPRA WORTEN", value:79.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-23"), paymentDate:new Date("2017-08-23"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-23"), paymentDate:new Date("2017-08-23"), category:"Roupas", store:"COMPRA WOMEN SECRET C", value:35.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-23"), paymentDate:new Date("2017-08-23"), category:"Artigos para casa", store:"COMPRA IKEA LOURES BU", value:48.96, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-23"), paymentDate:new Date("2017-08-23"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-23"), paymentDate:new Date("2017-08-23"), category:"Luz / Gás", store:"PAGAMENTO", value:65.45, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-24"), paymentDate:new Date("2017-08-24"), category:"Supermercado", store:"COMPRA MINIPRECO", value:15.36, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-24"), paymentDate:new Date("2017-08-24"), category:"Remédios", store:"COMPRA WELLS", value:8.14, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-24"), paymentDate:new Date("2017-08-24"), category:"Supermercado", store:"COMPRA MINIPRECO", value:1.74, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-24"), paymentDate:new Date("2017-08-24"), category:"Restaurante", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-26"), paymentDate:new Date("2017-08-26"), category:"Poupança", store:"TRF CXDAPP", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-26"), paymentDate:new Date("2017-08-26"), category:"Hotel", store:"COMPRA ESTALAGEM SEQU", value:85.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-27"), paymentDate:new Date("2017-08-27"), category:"Supermercado", store:"COMPRA CONTINENTE", value:15.70, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-28"), paymentDate:new Date("2017-08-28"), category:"Poupança", store:"TRF CXDAPP", value:20.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-28"), paymentDate:new Date("2017-08-28"), category:"Médico", store:"COMPRA CUF ALVALADE C", value:22.94, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-28"), paymentDate:new Date("2017-08-28"), category:"Poupança", store:"TRF CXDAPP", value:13.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-29"), paymentDate:new Date("2017-08-29"), category:"Poupança", store:"TRF CXDAPP", value:20.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-29"), paymentDate:new Date("2017-08-29"), category:"Restaurante", store:"COMPRA MCDONALD S COL", value:3.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-29"), paymentDate:new Date("2017-08-29"), category:"Restaurante", store:"COMPRA MCDONALD S COL", value:3.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-29"), paymentDate:new Date("2017-08-29"), category:"Supermercado", store:"COMPRA MINIPRECO", value:6.46, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-29"), category:"Roupas", store:"COMPRAS C DEB PRIMARK", value:4.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-31"), category:"Salário", store:"TRF Caixadireta Emp", value:400.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-31"), category:"Médico", store:"COMPRA MEDI THALASSA", value:70.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-31"), category:"Restaurante", store:"COMPRA IL MERCATO DI", value:12.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-31"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-31"), category:"Diarista", store:"LEVANTAMENTO Ed Monum", value:140.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-08-31"), paymentDate:new Date("2017-08-31"), category:"Supermercado", store:"COMPRA MINIPRECO", value:43.58, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-01"), paymentDate:new Date("2017-09-01"), category:"Metro / Ônibus", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-01"), paymentDate:new Date("2017-09-01"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:9.10, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-01"), paymentDate:new Date("2017-09-01"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:1.30, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-02"), paymentDate:new Date("2017-09-02"), category:"Salão", store:"COMPRA MARLOU CAB LDA", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-02"), paymentDate:new Date("2017-09-02"), category:"Remédios", store:"COMPRA FARMACIA HOLON", value:13.70, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-03"), paymentDate:new Date("2017-09-03"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:26.69, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-01"), category:"Netflix", store:"COMPRA NETFLIX COM", value:11.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-04"), category:"Metro / Ônibus", store:"COMPRA QUINTA DAS CON", value:1.45, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-04"), category:"Artigos para casa", store:"COMPRA OCEANOCANELA U", value:11.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-04"), category:"Salário", store:"TRF Caixadireta Emp", value:200.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-04"), category:"Médico", store:"COMPRA HOSPITAL DA LU", value:15.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-04"), category:"Supermercado", store:"COMPRA CONTINENTE", value:40.07, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-04"), paymentDate:new Date("2017-09-04"), category:"Metro / Ônibus", store:"COMPRA MARQUES POMBAL", value:1.45, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-05"), paymentDate:new Date("2017-09-05"), category:"Luz / Gás", store:"EDP", value:61.01, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-05"), paymentDate:new Date("2017-09-05"), category:"Metro / Ônibus", store:"COMPRA QUINTA DAS CON", value:1.45, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-05"), paymentDate:new Date("2017-09-05"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:13.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-05"), paymentDate:new Date("2017-09-05"), category:"Metro / Ônibus", store:"COMPRA MARQUES POMBAL", value:2.90, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Água", store:"EPAL SA", value:54.07, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:7.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Restaurante", store:"COMPRA STARBUCKS COFF", value:6.90, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Salário", store:"TRF Caixadireta Emp", value:200.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Cinema", store:"COMPRA CIC  CINEMAS D", value:12.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Cinema", store:"COMPRA UCI CINEMAS", value:12.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Uber", store:"COMPRA APH JUMBO AMAD", value:16.40, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-06"), paymentDate:new Date("2017-09-06"), category:"Roupas", store:"COMPRA SPORT ZONE", value:24.98, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-07"), paymentDate:new Date("2017-09-07"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:14.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-07"), paymentDate:new Date("2017-09-07"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:11.77, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-08"), paymentDate:new Date("2017-09-05"), category:"Uber", store:"COMPRA UBER TRIP IYMP", value:2.77, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-08"), paymentDate:new Date("2017-09-05"), category:"Uber", store:"COMPRA UBER TRIP XHNC", value:2.59, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-08"), paymentDate:new Date("2017-09-08"), category:"Supermercado", store:"COMPRA NATURAL E ABST", value:11.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-08"), paymentDate:new Date("2017-09-08"), category:"Lavanderia", store:"LEVANTAMENTO Museu Or", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-08"), paymentDate:new Date("2017-09-08"), category:"Artigos para casa", store:"COMPRA SPORT ZONE", value:22.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-08"), paymentDate:new Date("2017-09-08"), category:"Artigos para casa", store:"COMPRA NEXTAROMAS", value:5.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-09"), paymentDate:new Date("2017-09-09"), category:"Supermercado", store:"COMPRA MINIPRECO", value:7.25, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-10"), paymentDate:new Date("2017-09-10"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-10"), paymentDate:new Date("2017-09-10"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:55.31, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-10"), paymentDate:new Date("2017-09-10"), category:"Supermercado", store:"COMPRA CONTINENTE", value:9.96, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-11"), paymentDate:new Date("2017-09-11"), category:"Bolso", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-11"), paymentDate:new Date("2017-09-11"), category:"Material Escolar", store:"COMPRA BERNARDINO ARA", value:35.25, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-11"), paymentDate:new Date("2017-09-11"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:15.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-11"), paymentDate:new Date("2017-09-11"), category:"Manutenção", store:"COM MANUTENCAO CONTA", value:5.15, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-12"), paymentDate:new Date("2017-09-09"), category:"Uber", store:"COMPRA UBER TRIP NIDY", value:7.25, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-13"), paymentDate:new Date("2017-09-13"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-13"), paymentDate:new Date("2017-09-13"), category:"Restaurante", store:"COMPRA HA BURGUERIA C", value:12.30, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-14"), paymentDate:new Date("2017-09-14"), category:"Restaurante", store:"COMPRA PAPA FINA", value:7.65, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-14"), paymentDate:new Date("2017-09-14"), category:"Médico", store:"COMPRA CUF DESCOBERTA", value:15.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-14"), paymentDate:new Date("2017-09-14"), category:"Remédios", store:"COMPRA WELL S CONTINE", value:5.69, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-14"), paymentDate:new Date("2017-09-14"), category:"Remédios", store:"COMPRA FARMACIA HOLON", value:3.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-14"), paymentDate:new Date("2017-09-14"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:5.02, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-15"), paymentDate:new Date("2017-09-15"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:6.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-15"), paymentDate:new Date("2017-09-15"), category:"Supermercado", store:"COMPRA MINIPRECO", value:8.87, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-17"), paymentDate:new Date("2017-09-17"), category:"Salário", store:"TRF Caixadireta Emp", value:100.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-17"), paymentDate:new Date("2017-09-17"), category:"Diversos", store:"COMPRA AMERICO MENDES", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-17"), paymentDate:new Date("2017-09-17"), category:"Artigos para casa", store:"COMPRA GRUTAS MOEDA", value:15.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-18"), paymentDate:new Date("2017-09-14"), category:"Uber", store:"COMPRA UBER TRIP BHHC", value:12.34, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-18"), paymentDate:new Date("2017-09-14"), category:"Uber", store:"COMPRA UBER TRIP 3IHI", value:19.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-18"), paymentDate:new Date("2017-09-18"), category:"Supermercado", store:"COMPRA PAPASONHOS LDA", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-18"), paymentDate:new Date("2017-09-18"), category:"Material Escolar", store:"COMPRA BERNARDINO ARA", value:3.18, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-18"), paymentDate:new Date("2017-09-18"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:13.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-20"), paymentDate:new Date("2017-09-20"), category:"Restaurante", store:"COMPRA GO NATURAL", value:6.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-20"), paymentDate:new Date("2017-09-20"), category:"Salário", store:"TRF Caixadireta Emp", value:399.44, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-20"), paymentDate:new Date("2017-09-20"), category:"IRS", store:"Multi Imposto", value:160.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-20"), paymentDate:new Date("2017-09-20"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:35.29, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-21"), paymentDate:new Date("2017-09-18"), category:"Uber", store:"COMPRA UBER TRIP LEA4", value:7.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-21"), paymentDate:new Date("2017-09-21"), category:"Restaurante", store:"COMPRA ISA MARCAL", value:5.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-21"), paymentDate:new Date("2017-09-21"), category:"Metro / Ônibus", store:"COMPRA ESTACAO ENTREC", value:1.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-22"), paymentDate:new Date("2017-09-22"), category:"Supermercado", store:"LEVANTAMENTO Av de Ro", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-22"), paymentDate:new Date("2017-09-22"), category:"Restaurante", store:"COMPRA JALMAHAL LDA", value:13.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-22"), paymentDate:new Date("2017-09-22"), category:"Remédios", store:"COMPRA TRADE MEDIC SA", value:7.73, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-22"), paymentDate:new Date("2017-09-22"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-23"), paymentDate:new Date("2017-09-23"), category:"Remédios", store:"COMPRA FARMACIA HOLON", value:3.90, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-24"), paymentDate:new Date("2017-09-24"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:17.16, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-24"), paymentDate:new Date("2017-09-24"), category:"Restaurante", store:"COMPRA MCDONALD S PRA", value:1.30, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-25"), paymentDate:new Date("2017-09-22"), category:"Uber", store:"COMPRA UBER TRIP QF3G", value:11.39, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-25"), paymentDate:new Date("2017-09-25"), category:"Supermercado", store:"COMPRA MINIPRECO", value:31.25, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-27"), paymentDate:new Date("2017-09-27"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:29.87, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-28"), paymentDate:new Date("2017-09-28"), category:"Restaurante", store:"COMPRA GO NATURAL", value:5.70, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-28"), paymentDate:new Date("2017-09-28"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-29"), paymentDate:new Date("2017-09-26"), category:"Uber", store:"COMPRA UBER TRIP 37BV", value:11.73, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-29"), paymentDate:new Date("2017-09-29"), category:"Salário", store:"TRF Caixadireta Emp",value:1000.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-29"), paymentDate:new Date("2017-09-29"), category:"Diarista", store:"LEVANTAMENTO Al Linha", value:150.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-29"), paymentDate:new Date("2017-09-29"), category:"Restaurante", store:"COMPRA CAFE CERVEJ SA", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-29"), paymentDate:new Date("2017-09-29"), category:"Restaurante", store:"COMPRA PRACALVA   GES", value:3.30, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-29"), paymentDate:new Date("2017-09-29"), category:"Restaurante", store:"COMPRA BEIJU TAPIOCAR", value:6.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-30"), paymentDate:new Date("2017-09-30"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-30"), paymentDate:new Date("2017-09-30"), category:"Supermercado", store:"COMPRA SUPERMERCA", value:13.97, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-09-30"), paymentDate:new Date("2017-09-30"), category:"Artigos para casa", store:"COMPRA BAZAR DOURADO", value:9.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},		
		{purchaseDate:new Date("2017-10-01"), paymentDate:new Date("2017-10-01"), category:"Restaurante", store:"COMPRA VITAMINAS   CO", value:9.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-01"), paymentDate:new Date("2017-10-01"), category:"Supermercado", store:"COMPRA APH JUMBO AMAD", value:90.34, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-01"), paymentDate:new Date("2017-10-01"), category:"Roupas", store:"COMPRA SPORT ZONE", value:23.93, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-01"), paymentDate:new Date("2017-10-01"), category:"Restaurante", store:"COMPRA CELEIRODIETAVI", value:4.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-09-30"), category:"Uber", store:"COMPRA UBER TRIP GHUD", value:14.95, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-10-02"), category:"Metro / Ônibus", store:"COMPRA ROMA", value:36.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-10-02"), category:"Restaurante", store:"COMPRA A MARIAZINHA", value:18.59, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-10-02"), category:"Restaurante", store:"COMPRA BRAZUNA PROD C", value:11.58, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-10-02"), category:"Supermercado", store:"COMPRA PINGO DOCE", value:4.13, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-10-02"), category:"Remédios", store:"COMPRA FARMACIA DOURO", value:16.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-02"), paymentDate:new Date("2017-10-02"), category:"Remédios", store:"COMPRA FARMACIA DOURO", value:18.60, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-03"), paymentDate:new Date("2017-10-03"), category:"Supermercado", store:"COMPRA 189   LISBOA", value:22.41, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-03"), paymentDate:new Date("2017-10-03"), category:"Restaurante", store:"COMPRA LE CHAT", value:5.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-04"), paymentDate:new Date("2017-10-01"), category:"Netflix", store:"COMPRA NETFLIX COM", value:11.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-04"), paymentDate:new Date("2017-10-04"), category:"Bolso", store:"LEVANTAMENTO C C Roma", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-04"), paymentDate:new Date("2017-10-04"), category:"Restaurante", store:"COMPRA REST AMARELO", value:12.70, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-04"), paymentDate:new Date("2017-10-04"), category:"Médico", store:"COMPRA MEDI THALASSA", value:70.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-05"), paymentDate:new Date("2017-10-05"), category:"Suplementos", store:"COMPRA SUPPLEMENTS ST", value:4.19, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-05"), paymentDate:new Date("2017-10-05"), category:"Restaurante", store:"COMPRA IL MERCADO DI", value:7.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-05"), paymentDate:new Date("2017-10-05"), category:"Roupas", store:"COMPRA DECATHLON", value:159.02, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-05"), paymentDate:new Date("2017-10-05"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-06"), paymentDate:new Date("2017-10-06"), category:"Academia", store:"easypay instituicao p", value:13.98, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-06"), paymentDate:new Date("2017-10-06"), category:"Luz / Gás", store:"EDP", value:63.23, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-06"), paymentDate:new Date("2017-10-06"), category:"Outros", store:"COMPRA IGCP IGESPAR", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-07"), paymentDate:new Date("2017-10-07"), category:"Restaurante", store:"COMPRA FARIA COUTINHO", value:11.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-08"), paymentDate:new Date("2017-10-08"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:22.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-09"), paymentDate:new Date("2017-10-06"), category:"Uber", store:"COMPRA UBER TRIP KZDD", value:6.39, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-09"), paymentDate:new Date("2017-10-09"), category:"Supermercado", store:"COMPRA BIOMERCADO", value:8.94, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-09"), paymentDate:new Date("2017-10-09"), category:"Supermercado", store:"COMPRA MINIPRECO", value:29.16, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-10"), paymentDate:new Date("2017-10-10"), category:"Academia", store:"easypay instituicao p", value:13.98, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-10"), paymentDate:new Date("2017-10-10"), category:"Academia", store:"LEVANTAMENTO Av de Ro", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-10"), paymentDate:new Date("2017-10-10"), category:"Remédios", store:"COMPRA FARMACIA CRUZ", value:5.16, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-10"), paymentDate:new Date("2017-10-10"), category:"Restaurante", store:"COMPRA SOPROFAR SOC", value:6.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-10"), paymentDate:new Date("2017-10-10"), category:"Correio", store:"COMPRA CTT   CORREIOS", value:1.40, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-12"), paymentDate:new Date("2017-10-10"), category:"Roupas", store:"COMPRAS C DEB PRIMARK", value:17.25, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-12"), paymentDate:new Date("2017-10-12"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Poupança", store:"TRF CXDAPP", value:10.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Bolso", store:"LEVANTAMENTO Av da Re", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Salário", store:"TRF Caixadireta Emp", value:350.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Remédios", store:"COMPRA MUSE GLAMOUR", value:23.95, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Restaurante", store:"COMPRA H3 MONUMENTAL", value:7.95, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Artigos para casa", store:"COMPRA QUERIDAS IDEIA", value:8.48, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Supermercado", store:"COMPRA 189   LISBOA", value:29.40, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-13"), paymentDate:new Date("2017-10-13"), category:"Manutenção", store:"COM MANUTENCAO CONTA", value:5.15, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-14"), paymentDate:new Date("2017-10-14"), category:"Supermercado", store:"COMPRA PINGO DOCE", value:2.33, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-14"), paymentDate:new Date("2017-10-14"), category:"Suplementos", store:"COMPRA CELEIRO DIETA", value:28.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-15"), paymentDate:new Date("2017-10-15"), category:"Poupança", store:"TRF CXDAPP", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-15"), paymentDate:new Date("2017-10-15"), category:"Restaurante", store:"COMPRA AMOR AOS PEDAC", value:1.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-15"), paymentDate:new Date("2017-10-15"), category:"Restaurante", store:"COMPRA AMOR AOS PEDAC", value:1.10, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-15"), paymentDate:new Date("2017-10-15"), category:"Supermercado", store:"COMPRA CONTINENTE", value:55.40, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-15"), paymentDate:new Date("2017-10-15"), category:"Supermercado", store:"COMPRA CONTINENTE", value:21.23, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-16"), paymentDate:new Date("2017-10-16"), category:"Remédios", store:"COMPRA FARMACIA BELO", value:9.95, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-15"), category:"Roupas", store:"COMPRAS C DEB PRIMARK", value:5.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-17"), category:"ATL", store:"ATL Giovanna Variani", value:30.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-17"), category:"Escola", store:"Alimenta  o Giovanna", value:46.72, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-17"), category:"Supermercado", store:"COMPRA PINGO DOCE", value:13.79, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-17"), category:"Salão", store:"LEVANTAMENTO C C Roma", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-17"), category:"Selo Transferência", store:"COMISSAO IMP SELO TRF", value:0.52, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-17"), paymentDate:new Date("2017-10-17"), category:"Selo Transferência", store:"COMISSAO IMP SELO TRF", value:0.52, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-18"), paymentDate:new Date("2017-10-18"), category:"Roupas", store:"COMPRA CALZEDONIA", value:7.90, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-18"), paymentDate:new Date("2017-10-18"), category:"Material de Escritório", store:"COMPRA WORTEN", value:9.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-18"), paymentDate:new Date("2017-10-18"), category:"Salário", store:"TRF Caixadirecta EMP", value:415.42, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-18"), paymentDate:new Date("2017-10-18"), category:"IRS", store:"Multi Imposto", value:232.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-19"), paymentDate:new Date("2017-10-19"), category:"Diversos", store:"COMPRA BRICODIS TELHE", value:17.69, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-19"), paymentDate:new Date("2017-10-19"), category:"Supermercado", store:"COMPRA CONTINENTE", value:17.78, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-19"), paymentDate:new Date("2017-10-19"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-19"), paymentDate:new Date("2017-10-19"), category:"Restaurante", store:"COMPRA PADARIA DUQUE", value:7.43, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-19"), paymentDate:new Date("2017-10-19"), category:"Restaurante", store:"COMPRA MCDONALD S SAL", value:3.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-20"), paymentDate:new Date("2017-10-20"), category:"Academia", store:"easypay instituicao p", value:13.98, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-20"), paymentDate:new Date("2017-10-20"), category:"Correio", store:"COMPRA CTT   CORREIOS", value:1.10, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-20"), paymentDate:new Date("2017-10-20"), category:"Restaurante", store:"COMPRA CAFE 3   RESTA", value:7.85, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-21"), paymentDate:new Date("2017-10-18"), category:"Uber", store:"COMPRA UBER TRIP CLB5", value:2.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-22"), paymentDate:new Date("2017-10-22"), category:"Supermercado", store:"COMPRA MINIPRECO", value:44.99, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-22"), paymentDate:new Date("2017-10-22"), category:"Médico", store:"TRF CXDAPP", value:40.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-22"), paymentDate:new Date("2017-10-22"), category:"Bolso", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-22"), paymentDate:new Date("2017-10-22"), category:"Supermercado", store:"COMPRA MINIPRECO", value:5.27, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-24"), paymentDate:new Date("2017-10-24"), category:"Reembolso", store:"TRF Caixadireta Emp", value:50.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-24"), paymentDate:new Date("2017-10-24"), category:"Restaurante", store:"COMPRA H3 CAMPO PEQUE", value:7.95, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-24"), paymentDate:new Date("2017-10-24"), category:"Supermercado", store:"COMPRA PINGO DOCE", value:14.64, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-25"), paymentDate:new Date("2017-10-25"), category:"Reembolso", store:"TRF Caixadireta Emp", value:50.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-25"), paymentDate:new Date("2017-10-25"), category:"Médico", store:"COMPRA CUF DESCOBERTA", value:27.50, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-26"), paymentDate:new Date("2017-10-26"), category:"Reembolso", store:"TRF MEDIS COMPANHIA P", value:42.00, isDebit:false, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-26"), paymentDate:new Date("2017-10-26"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-26"), paymentDate:new Date("2017-10-26"), category:"Correio", store:"COMPRA CTT   CORREIOS", value:1.10, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-26"), paymentDate:new Date("2017-10-26"), category:"Supermercado", store:"COMPRA MINIPRECO", value:9.08, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-27"), paymentDate:new Date("2017-10-27"), category:"Restaurante", store:"COMPRA H3 CAMPO PEQUE", value:7.95, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-27"), paymentDate:new Date("2017-10-27"), category:"Material de Escritório", store:"COMPRA BAZAR DOURADO", value:7.20, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-29"), paymentDate:new Date("2017-10-29"), category:"Supermercado", store:"COMPRA PINGO DOCE S A", value:38.09, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-30"), paymentDate:new Date("2017-10-30"), category:"Salário", store:"Ordenado", value:1000.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-30"), paymentDate:new Date("2017-10-30"), category:"Supermercado", store:"LEVANTAMENTO R Filipa", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-30"), paymentDate:new Date("2017-10-30"), category:"Supermercado", store:"COMPRA PINGO DOCE", value:3.53, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-31"), paymentDate:new Date("2017-10-31"), category:"Lavanderia", store:"LEVANTAMENTO Al Linha", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-31"), paymentDate:new Date("2017-10-31"), category:"Academia", store:"LEVANTAMENTO Al Linha", value:10.00, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-31"), paymentDate:new Date("2017-10-31"), category:"Suplementos", store:"COMPRA TIAGO BRUNO DO", value:53.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-31"), paymentDate:new Date("2017-10-31"), category:"Lavanderia", store:"COMPRA CC ALVALADE 5", value:13.80, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-31"), paymentDate:new Date("2017-10-31"), category:"Restaurante", store:"COMPRA BRAZUNA PROD C", value:6.65, isDebit:true, bankAccount:"Conta Conjunta Principal"},
		{purchaseDate:new Date("2017-10-31"), paymentDate:new Date("2017-10-31"), category:"Lavanderia", store:"LEVANTAMENTO Mouras S", value:20.00, isDebit:true, bankAccount:"Conta Conjunta Principal"}
	],
	categories,
	bankAccounts,
	creditCards	
);

db.logout();

print("FINISHED!")