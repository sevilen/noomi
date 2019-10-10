import { RedisFactory } from "../../core/ts/redisfactory";

RedisFactory.addClient({
    name:'default',
    host:'localhost',
    port:'3333'
});
let client = RedisFactory.getClient('default');
client.set('xxx',2);
// client.hmset('xxx',{
//     id:1,
//     name:'bbb'
// });

// // client.expire('xxx',5);
// client.hget('xxx','name',(err,value)=>{
//     if(err){throw err};
//     console.log(value)
// });

// setTimeout(()=>{
//     client.hget('xxx','name',(err,value)=>{
//         if(err){throw err};
//         console.log(value)
//     });
// },6000);
// client.hmset('xxx', {
//     age: 2,
//     sex: 'F',
//     yyy:{
//         u:'yang'
//     }
//   },(err,obj)=>{
//     console.log(err);
// });
// client.hdel('xxx','yyy');
// // client.hset('xxx','yyy',{
// //     u:'lei'
// // });
// client.hget('xxx','yyy',(err,value)=>{
//     console.log(value.u);
// })


// RedisFactory.get('default','aaa','name').then(value=>{
//     console.log(value);
// });

