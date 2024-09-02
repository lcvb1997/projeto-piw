import { openDb } from '../configDatabase.js';

//Criar banco de dados
export async function createTable(){
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Cliente (id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER)');
    })
}

//Mostrar informações no banco de dados
export async function selectClientes(req, res){
    openDb().then(db=>{
        db.all('SELECT * FROM Cliente').then(clientes=>res.json(clientes));
    })
}

//Mostrar informações sobre um cliente no banco de dados
export async function selectCliente(req, res){
    let id = req.body.id;
    openDb().then(db=>{
        db.get('SELECT * FROM Cliente WHERE id=?',[id] ).then(cliente=>res.json(cliente));
    })
}

//Inserir informações no banco de dados
export async function insertCliente(req, res){
    let cliente = req.body;
    openDb().then(db=>{
        db.run('INSERT INTO Cliente (nome, idade) VALUES (?,?)', [cliente.nome, cliente.idade

        ]);
        res.json({
            "Statuscode": 200
        })
    })
}
//Atualizar informações no banco de dados
export async function updateCliente(req, res){
    let cliente = req.body;
    openDb().then(db=>{
        db.run('UPDATE Cliente SET nome=?, idade=? WHERE id=?', [cliente.nome, cliente.idade, cliente.id

        ]);
        res.json({
            "Statuscode": 200
        })
    })
}

//Excluir informações no banco de dados
export async function deleteCliente(req, res){
    let id = req.body.id;
   openDb().then(db=>{
        db.get('DELETE FROM Cliente WHERE id=?', [id]).then(res=>res);
    });
    res.json({
        "Statuscode": 200
    })
}