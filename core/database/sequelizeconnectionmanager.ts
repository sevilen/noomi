import {Sequelize as SequelizeOrigin} from 'sequelize';
import { Sequelize } from "sequelize-typescript";
import { Resource } from "../../test/app/module/dao/pojosequelize/resource";
import { ResourceAuthority } from "../../test/app/module/dao/pojosequelize/resourceauthority";
import { Authority } from "../../test/app/module/dao/pojosequelize/authority";
import { TransactionManager } from "./transactionmanager";

/**
 * 连接管理器
 */
class SequelizeConnectionManager{
    sequelize:Sequelize;
    connection:any;
    options:object;
    dbMdl:any;
    usePool:boolean;
    poolAlias:string;       //pool别名
    constructor(cfg){
        //使用cli-hooked
        // sequelize-typescript不支持cls，要用sequelize
        SequelizeOrigin.useCLS(TransactionManager.namespace);
        this.sequelize = new Sequelize(cfg);
        this.sequelize.addModels([Resource,Authority,ResourceAuthority]);
    }

    /**
     * 获取连接
     */
    async getConnection(){
        return this.sequelize;
    }

    /**
     * 释放连接
     * @param conn 
     */
    async release(conn?:any){
        // if(this.sequelize){
        //     this.sequelize.close();
        // }
    }
}


export{SequelizeConnectionManager}