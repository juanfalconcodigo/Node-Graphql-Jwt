import { IResolvers } from "graphql-tools";
import { Datetime } from '../lib/datetime';
import bcrypt from 'bcrypt';
const mutation : IResolvers={
    Mutation:{
        async register(__:void,{user},{db}):Promise<any>{
           const userFind=await db.collection('user').findOne({email:user.email});
           if(userFind!==null){
            return {
                status:false,
                message:`El email es único ya existe : ${userFind.email}`,
                user:null
            }
           }

           const lastUser=await db.collection('user').find().limit(1).sort({registerDate:-1}).toArray();
           (lastUser.length===0)?user.id=1:user.id=lastUser[0].id+1;
           user.password=bcrypt.hashSync(user.password,10);
           user.registerDate=await new Datetime().getCurrentDateTime();
           return await db.collection('user').insertOne(user).then((result:any)=>{
               return {
                   status:true,
                   message:`El usuario ${user.name} se añadio exitosamente`,
                   user
               }
           }).catch((err:any)=>{
            return {
                   status:false,
                   message:`El usuario NO se añadio exitosamente`,
                   user:null
               }
           });
        }
    }
}

export default mutation;