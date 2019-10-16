import { HttpRequest } from "./ts/httprequest";
import { HttpResponse } from "./ts/httpresponse";
import { WebConfig } from "./ts/webconfig";
import { RouteFactory } from "./ts/routefactory";
import { FilterFactory } from "./ts/filterfactory";
import { StaticResource } from "./ts/staticresource";

/**
 * request 队列
 */
interface RequestItem{
    req:HttpRequest;        //request
    expire?:number;         //过期时间
}
class RequestQueue{
    static queue:Array<RequestItem> = []; 
    //可以处理标志
    static canHandle:boolean = true;
    /**
     * 加入队列
     * @param req 
     * @param res 
     */
    static add(req:HttpRequest){
        let timeout = WebConfig.get('request_timeout') || 0;
        
        this.queue.push({
            req:req,
            expire:timeout>0?new Date().getTime() + timeout*1000:0
        });
    }

    /**
     * 处理队列
     */
    static handle(){
        //延迟执行
        if(!this.canHandle || this.queue.length === 0){
            this.canHandle = true;
            setImmediate(()=>{
                RequestQueue.handle();
            });
            return;
        }
        let item:any = this.queue.shift();
        if(item.expire === 0 || item.expire > new Date().getTime()){
            this.handleOne(item.req);
        }
        this.handle();
    }
    
    /**
     * 资源访问
     * @param request   request
     * @param path      url路径
     */
    
    static handleOne(request:HttpRequest){
        let path = require('url').parse(request.url).pathname;
        if(path === ''){
            return;
        }
        //获得路由，可能没有，则归属于静态资源
        let route = RouteFactory.getRoute(path);
        //路由资源
        if(route !== null){
            //参数
            request.init().then((params)=>{
                //过滤器执行
                FilterFactory.doChain(request.url,request,request.response).then((r)=>{
                    if(r){
                        //路由调用
                        RouteFactory.handleRoute(route,params,request,request.response);
                    }
                });
            });    
        }else{ //静态资源
            StaticResource.load(request.response,path);
        }
    }

    /**
     * 设置允许处理标志
     * @param v 
     */
    static setCanHandle(v:boolean){
        this.canHandle = v;
    }
}

export {RequestQueue}