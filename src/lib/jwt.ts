import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/constant';

class Jwt{
    private key:string;
    constructor(){
        this.key=SECRET_KEY as string;
    }

    sign(user:any):string{
        return jwt.sign({user},this.key,{expiresIn:'1h'});
    }

    verify(token:string):string{
        try {
            return jwt.verify(token,this.key) as string;
            
        } catch (err) {
            return `La autenticación es erronea o su token expiro`;
        }
    }

}

export default Jwt;