import { openDb } from '../configDatabase.js';

//Criar banco de dados
export async function createTable(){
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Cliente (id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER)');
    })
}
//Inserir informações no banco de dados
export async function insertCliente(cliente){
    openDb().then(db=>{
        db.run('INSERT INTO Cliente (nome, idade) VALUES (?,?)', [cliente.nome, cliente.idade]);
    })
}
//Atualizar informações no banco de dados
export async function updateCliente(cliente){
    openDb().then(db=>{
        db.run('UPDATE Cliente SET nome=?, idade=? WHERE id=?', [cliente.nome, cliente.idade, cliente.id]);
    })
}
//Mostrar informações no banco de dados
export async function selectClientes(cliente){
    return openDb().then(db=>{
        return db.all('SELECT * FROM Cliente').then(res=>res)
    })
}

//Mostrar informações sobre um cliente no banco de dados
export async function selectCliente(id){
    return openDb().then(db=>{
        return db.get('SELECT * FROM Cliente WHERE id=?',[id] ).then(res=>res)
    })
}


//Excluir informações no banco de dados
export async function deleteCliente(id){
   return openDb().then(db=>{
        return db.get('DELETE FROM Cliente WHERE id=?', [id]).then(res=>res);
    })
}