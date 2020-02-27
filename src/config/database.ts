import MongoClient from 'mongodb';

class Database{
    private mongo_uri:string;

    constructor(){
        this.mongo_uri=String(process.env.DATABASE);
    }

    async init (){
        const client=await MongoClient.connect(this.mongo_uri,{useNewUrlParser:true,useUnifiedTopology: true});
        const db=await client.db();
        if(client.isConnected()){
            console.log('==========Database Online==========');
            console.log(`Database : ${db.databaseName}`);
        }
        return db;
    }

}

export default Database;