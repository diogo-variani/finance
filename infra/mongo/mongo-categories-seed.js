/**************************************************/
/*********       UTILITY FUNCTIONS        *********/
/**************************************************/


function insertRoots( roots ){

	print("----------------------------------");
	print("Inserting root categories...");
	
	var bulk = db.categories.initializeOrderedBulkOp();
	roots.forEach( root => {
		print( tojson( root ) );
		bulk.insert( root );
	});
	bulk.execute( );
	print("Root categories inserted successfully!");
}

function insertChildren( parent, children ){

	print("----------------------------------");
	print(`Inserting ${parent.title} categories...`);
	
	var parent = db.categories.findOne(parent);
	if( parent ){
		var bulk = db.categories.initializeOrderedBulkOp();		
		children.forEach( child => {
			child.parentId = parent._id;

			print( tojson( child ) );

			bulk.insert( child ) 
		});
		bulk.execute( );
		print(`${parent.title} categories inserted successfully!`);
	}else{
		print(`${parent.title} category NOT FOUND!`);
	}	
}

/**************************************************/
/***************       SCRIPT       ***************/
/**************************************************/

conn = new Mongo();
db = conn.getDB("finance");

print("Please, provide finance-user password...")
db.auth("finance-user", passwordPrompt())

// Insert roots
insertRoots(
	[
		{ title: "Alimentação", description: "Centraliza despesas com alimentação." },
		{ title: "Casa", description: "Tem como objetivo agrupar despesas com a casa/moradia." },
		{ title: "Receita", description: "Agrupa receitas das mais diversas formas." },
		{ title: "Saúde", description: "Centraliza gastos com saúde." },
		{ title: "Transporte", description: "Centraliza gastos com transporte." },
		{ title: "Lazer", description: "Agrupa despesas investidas em lazer." },
		{ title: "Educação", description: "Gastos efetuados com educação e cursos." },
		{ title: "Pessoal", description: "Despesas pessoais." },
		{ title: "Tarifas", description: "Centraliza gastos com despesas bancárias." },
		{ title: "Impostos", description: "Gastos utilizados impostos." },
		{ title: "Levantamento", description: "Saques/Levantamentos realizados das contas bancárias." },
		{ title: "Diversos", description: "Gastos diversos." }
	]
);

//Inserting Alimentação nodes
insertChildren(
	{title: "Alimentação"},
	[
		{ title: "Restaurante", description: "Centraliza despesas com restaurantes." },
		{ title: "Supermercado", description: "Tem como objetivo agrupar despesas com supermercado." } 
	]
);

//Inserting Casa nodes
insertChildren(
	{title: "Casa"},
	[		
		{ title: "Aluguel", description: "Centraliza despesas com aluguéis." },
		{ title: "Internet", description: "Centraliza despesas com internet." },
		{ title: "Luz / Gás", description: "Centraliza despesas com luz / gás." },
		{ title: "Telefone", description: "Centraliza despesas com telefone." },
		{ title: "Netflix", description: "Centraliza despesas com Netflix." },
		{ title: "Telemóvel", description: "Centraliza despesas com telemóvel." },
		{ title: "Água", description: "Centraliza despesas com água." },
		{ title: "Diarista", description: "Centraliza despesas com diarista." },
		{ title: "Artigos para casa", description: "Centraliza despesas com artigos de casa." },
		{ title: "Eletrodomésticos", description: "Centraliza despesas com eletrodomésticos." },
		{ title: "Lavanderia", description: "Centraliza despesas com lavanderia." },
		{ title: "Diversos", description: "Centraliza despesas diversas com casa." }
	]
);

//Inserting Receita nodes
insertChildren(
	{title: "Receita"},
	[		
		{ title: "Salário", description: "Centraliza receitas com salário." },
		{ title: "Poupança", description: "Centraliza receitas com poupança." },
		{ title: "Reembolso", description: "Centraliza receitas com reembolso." }
	]
);

//Inserting Saúde nodes
insertChildren(
	{title: "Saúde"},
	[		
		{ title: "Dentista", description: "Centraliza despesas diversas com dentistas." },
		{ title: "Médico", description: "Centraliza despesas diversas com médicos." },
		{ title: "Remédios", description: "Centraliza despesas diversas com remédios." },
		{ title: "Academia", description: "Centraliza despesas diversas com academia." },
		{ title: "Suplementos", description: "Centraliza despesas diversas com suplementos." }
	]
);

//Inserting Transporte nodes
insertChildren(
	{title: "Transporte"},
	[		
		{ title: "Combustível", description: "Centraliza despesas diversas com combustível." },
		{ title: "Metro / Ônibus", description: "Centraliza despesas diversas com metro/ônibus." },
		{ title: "Uber", description: "Centraliza despesas diversas com Uber." },
		{ title: "Passe", description: "Centraliza despesas diversas com passe mensal de transporte público." }		
	]
);

//Inserting Lazer nodes
insertChildren(
	{title: "Lazer"},
	[		
		{ title: "Cinema", description: "Centraliza despesas diversas com cinema." },
		{ title: "Hotel", description: "Centraliza despesas diversas com hotel." },
		{ title: "Outros", description: "Centraliza despesas diversas com outros tipos de lazeres." }		
	]
);

//Inserting Educação nodes
insertChildren(
	{title: "Educação"},
	[		
		{ title: "Escola", description: "Centraliza despesas diversas com escola." },
		{ title: "Material Escolar", description: "Centraliza despesas diversas com material escolar." },
		{ title: "Idiomas", description: "Centraliza despesas diversas com escolas de idiomas." },
		{ title: "Alimentação Escolar", description: "Centraliza despesas diversas com alimentação efetuadas na escola." },
		{ title: "ATL", description: "Centraliza despesas de educação gastas com o ATL."}
	]
);

//Inserting Pessoal nodes
insertChildren(
	{title: "Pessoal"},
	[		
		{ title: "Roupas", description: "Centraliza despesas diversas com roupas." },
		{ title: "Calçados", description: "Centraliza despesas diversas com calçados." },
		{ title: "Salão", description: "Centraliza despesas diversas com salão." },
		{ title: "Brinquedos", description: "Centraliza despesas diversas com brinquedos." },
		{ title: "Maquiagem", description: "Centraliza despesas diversas com maquiagem." },
		{ title: "Diversos", description: "Centraliza despesas diversas com diversos." },
		{ title: "Presentes", description: "Centraliza despesas diversas com presentes." },
		{ title: "Acessórios", description: "Centraliza despesas diversas com acessórios pessoais." }
	]
);

//Inserting Tarifas nodes
insertChildren(
	{title: "Tarifas"},
	[		
		{ title: "Selo Transferência", description: "" },
		{ title: "Manutenção", description: "" },
		{ title: "Anuidade", description: "" }
	]
);

//Inserting Impostos nodes
insertChildren(
	{title: "Impostos"},
	[		
		{ title: "IRS", description: "Centraliza gastos com impostos do imposto de renda." },
		{ title: "Seguranca Social", description: "Centraliza gastos com impostos da segurança social." }
	]
);

//Inserting Levantamento nodes
insertChildren(
	{title: "Levantamento"},
	[		
		{ title: "Bolso", description: "Centraliza levantamentos/saques realizados." }		
	]
);

insertChildren(
	{title: "Diversos"},
	[		
		{ title: "Correio", description: "Centraliza despesas com o envio de correspondências." },
		{ title: "Material de Escritório", description: "Centraliza despesas com materiais de escritórios." }
	]
);

db.logout()

print("FINISHED!")