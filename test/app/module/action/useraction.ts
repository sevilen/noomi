import { Inject, Instance, Router, Route, DataModel, NullCheck } from "../../../../core/tools/decorator";
import { UserService } from "../service/userservice";
import { BaseRoute } from "../../../../core/main/route/baseroute";
import { DataImpl } from "../service/dataimpl";
import { MUser } from "../model/muser";

/**
 * 测试用户
 */
@Router({
    namespace:'/user',
    path:'/'
})
@DataModel(MUser)
class UserAction extends BaseRoute{
    userName:string;
    @Inject("userService")
    userService:UserService;
    @Inject("dataImpl")
    dataImpl:DataImpl;

    downloadPath:string;
    
    async user(){
        return{success:true,user:'yes'};
    }
    @Route({
        path:'/addres'
    })

    async addres(){
        try{
            let r = await this.dataImpl.add();
            return{
                success:true,
                result:r
            }
        }catch(e){
            return {success:false,result:e.message};
        }
    }
    getUserName(){
        return this.userName;
    }

    @Route({
        path:'/getinfo',
        results:[{
            "value":1,
            "type":"redirect",
            "url":"/user/showinfo",
            "params":["userName"]
        },{
            "value":2,
            "type":"chain",
            "url":"/user/last1",
            "params":["type"]
        },{
            value:3,
            type:'stream',
            // url:'/user/down',
            params:['downloadPath']
        }]
    })
    @NullCheck(['userName'])
    getinfo(params){
        console.log(this.model);
        if(params.type==1){
            this.userName = 'aaa';
            return 1;
        }else if(params.type==2){
            this.userName = 'bbb';
            return 2;
        }else if(params.type==3){
            this.downloadPath = '/test/test.js';
            return 3;
        }
        
        return {
            success:true,
            result:'哈哈123232!'
        }
    }

    @Route('/showinfo')
    @NullCheck(['age'])
    async showinfo(params){
        return await new Promise((resolve,reject)=>{
            if(params.userName === 'aaa'){
                resolve({
                    success:true,
                    result:1
                });
            }else{
                resolve({
                    success:true,
                    result:params.userName
                });
            }
        });
    }

    @Route('/last')
    last(params){
        // return params.type;
        return {
            info:"this is the last info"
        }
    }


    async addtwo(){
        try{
            let r = await this.userService.addTwoUser(this.model.id,this.model.name,this.model.age,this.model.mobile);
            return {success:true}
        }catch(e){
            return {success:false,msg:e};
        }
    }

    async testNest(){
        try{
            let r = await this.dataImpl.methodA();
            return {success:true}
        }catch(e){
            return {success:false,msg:e};
        }
    }
}

export {UserAction};