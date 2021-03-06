import { getConnection, closeConnection, getManager } from "../../../../core/database/connectionmanager";
import { Transaction, Instance, Transactioner, Inject } from "../../../../core/tools/decorator";
// import { Resource } from "../dao/pojo/resource";
// import { ResourceAuthority } from "../dao/pojo/resourceauthority";
// import { EntityManager } from "typeorm";
// import Resource from "../dao/pojosequelize/resource";
// import ResourceAuthority from "../dao/pojosequelize/resourceauthority";
// import { Sequelize } from "sequelize-typescript";
import { UserService } from "./userservice";
import { User } from "../dao/entity/user";
import { Connection, EntityManagerFactory ,EntityManager} from "relaen";
import { UserInfo } from "../dao/entity/userinfo";

// import { Resource } from "../dao/pojo/resource";
// import { EntityManager } from "typeorm";
// import ResourceAuthority from "../dao/pojosequelize/resourceauthority";
// import Resource from "../dao/pojosequelize/resource";

@Transactioner()
class DataImpl{
    @Inject('userService')
    us:UserService;
    // @Transaction()
    async addRes(url:string,id?:number){
        //mysql
        // let sql:string = "insert into t_resource(url,resource_id) values(?,?)";
        // let r = await new Promise(async (resolve,reject)=>{
        //     let conn = await getConnection();
        //     if(conn == null){
        //         reject("conn is null");
        //     }
        //     conn.query(sql,[url,id],(err,result)=>{
        //         if(err){
        //             reject(err);
        //         }
        //         resolve(result);
        //     });
        // });
        
        //oracle
        // let sql:string = "insert into t_resource(resource_id,url) values(13,'"+url+"')";
        // let conn = await getConnection();
        // let r = await conn.execute(sql);
        
        //mssql
        // let sql:string = "insert into t_resource(resource_id,url) values(14,'"+url+"')";
        // let conn = await getConnection();
        // let r = await conn.query(sql);

        //sequelize
        // let seq:Sequelize  = await getConnection();
        // let res:Resource = await seq.getRepository(Resource).create({
        //     resourceId:id,
        //     url:url
        // });
        // let r1 = await res.save();
        //typeorm
        // let res = new Resource();
        // res.resourceId = id;
        // res.url = url;
        // let manager:EntityManager = await getManager();
        // let r1 = await manager.save(res);
        
        //relaen
        // let em:EntityManager = await getManager();
        let user:User = new User(id);
        user.setUserName('aaaa');
        await user.save(true);
        // em.save(user);
        let ui:UserInfo = new UserInfo();
        ui.setRealName('yang');
        ui.setAge(10);
        ui.setSexy('M');
        ui.setUser(user);
        await ui.save(true);
        // await em.close();
        return 2;
    }
    // @Transaction()
    async addResAuth(){
        //mysql
        // let sql:string = "insert into t_resource_authority(resource_id,authority_id) values(3,4)";
        // let r = await new Promise(async (resolve,reject)=>{
        //     let conn = await getConnection();
        //     conn.query(sql,(err,result)=>{
        //         if(err){
        //             reject(err);
        //         }
        //         resolve(result);
        //     });
        // });

        //oracle
        // let sql:string = "insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values(2,3,4)";
        // let conn = await getConnection();
        // let r = await conn.execute(sql);
        
        //mssql
        // let sql:string = "insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values(2,3,4)";
        // let conn = await getConnection();
        // try{
        //     let r = await conn.query(sql);
        // }catch(e){
        //     console.log(e);
        // }
        
        //sequelize
        // const res = new Resource({
        //     resourceId:100,
        //     authorityId:2
        // })
        // let r1 = await res.save();

        //typeorm
        // let manager:EntityManager = await getManager();
        // const res = new ResourceAuthority();
        // await manager.save(res);
        // return 1;

        //relaen
        // let conn:Connection = await getConnection();
        // let em:EntityManager = EntityManagerFactory.createEntityManager(conn);
        // let user:User = new User(4);
        // user.setUserName('yanglei');
        // user.setAge(10);
        // user.setSexy('M');
        // await user.save();
        // em.close();
        // await conn.close();
    }
    
    // @Transaction()
    async add(){
        // let r1 = await this.addResAuth();
        // try{
            // let r1 = await this.addRes('/testtran');
            // let r2 = await this.addRes('/testtran1',14);
        // }catch(e){
        //     return false;
        // }
        // this.us.sayHello();
        // let r1 = await this.addRes('/testtran1');
        // throw 'hahaha';
        
        // await this.addResAuth();
        await this.addRes('/testtran1',100);
        await this.addRes('/testtran1',100);
        return true;
        // if(r1 === 1 && r2 === 2){
        //     return true;
        // }else{
        //     return false;
        // }
    }


    async methodA(){
        // try{
            await this.mehtodB();
        // }catch(e){
        //     console.log(e);
        // }
        
        // await this.methodC();
        console.log('finished');
    }

    async mehtodB(){
        // throw new Error('methodB failed');
        await this.methodC();
    }

    async methodC(){
        throw new Error('methodB failed');
    }
}

export{DataImpl}