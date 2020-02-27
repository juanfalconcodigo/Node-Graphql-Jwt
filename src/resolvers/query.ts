import { IResolvers } from "graphql-tools";
import Jwt from "../lib/jwt";
import bcrypt from 'bcrypt';

const query : IResolvers={
    Query:{
        async users(_:void,__:any,{db}):Promise<any>{
            const users=await db.collection('user').find({}).toArray();
            return users;
        },
        async login(_:void,{email,password},{db}):Promise<any>{
            const user=await db.collection('user').findOne({email});
            if(user===null){
                return {
                    status:false,
                    message:`No se encuentra registrado(a)`,
                    token:null
                }
            }
            if(!bcrypt.compareSync(password,user.password)){
                return {
                    status:false,
                    message:`Verifique sus datos`,
                    token:null
                }
            }
            //delete  elimina una propiedad de un objeto
            delete user.password;
            return {
                status:true,
                message:`Ingreso exitoso`,
                token:new Jwt().sign(user)
            }
        },
        async me(_:void,__:any,{token}):Promise<any>{
            const info:any=new Jwt().verify(token);
            if(info===`La autenticación es erronea o su token expiro`){
                return {
                    status:false,
                    message:info,
                    user:null
                }
            }
            return {
                status:true,
                message:`Token correcto`,
                user:info.user
            }
        }
    }
}

export default query;