const router=require('express').Router();;
const bodyParser=require('body-parser');
const pusher=require('./pusher');
const conn=require('./db');
var itemsPerPage=0;
var maxNumPerPage=10;
var totalItems=0;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// to get all records from info table 
router.get('/all/:start([0-9]+)',(req,res)=>{
    
    var pages=req.params.page || 1;
    var start=req.params.start || itemsPerPage;
        conn.query('select count(*) as total from info',(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                if(rows.rows.length > 0){
                    pages=rows.rows[0].total/maxNumPerPage;
                    totalItems=rows.rows[0].total;
                }
            }
        });
        conn.query('select * from info  order by id DESC limit '+maxNumPerPage+' offset '+start,(err,rows,fields)=>{
            if(err){
                throw err
            }else{

                if(rows.rows.length > 0){
                    res.json({
                        rows:rows.rows,
                        itemsPerPage:itemsPerPage,
                        pages:pages,
                        totalItems:totalItems
                    });
                }else{
                    res.json({msg:"No Records have been added yet"});
                }
            }
        });
});


//to get only one record from info table
router.get('/info/:id([0-9]+)',(req,res)=>{
    const id=req.params.id;
        conn.query('select * from info where id='+id+'',(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                console.log(rows.rows.length);
                if(rows.rows.length > 0){
                    res.json(rows.rows);
                }else{
                    res.json({
                        msg:"No Match was found for this id",
                        match:false
                    });
                }
            }
        });
});


//to delete only one record from info table
router.delete('/info/:id([0-9]+)',(req,res)=>{
    const id=req.params.id;
        conn.query('delete from info where id='+id,(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                if(rows.rowCount > 0){
                   res.json({msg:"This Record was deleted successfully",data:rows.rows});
                   pusher.trigger('channel-test','event-test',{
                    msg:'This Record was deleted successfully'
                   });
                }else{
                    pusher.trigger('channel-test','event-test',{
                        msg:'No Match was found for this id'
                       });
                       res.json({
                        msg:"No Match was found for this id",
                        match:false
                    });
                }
            }
        });
});


//to update only one record from info table
router.put('/info/:id([0-9]+)',(req,res)=>{
    const id=req.params.id;
    const name=req.body.name;
    const age=req.body.age;
    const salary=req.body.salary;
    const hire_date=req.body.hire_date;
    const data=[name,parseInt(age),parseInt(salary),hire_date,parseInt(id)];
        conn.query("update info set name='"+name+"' ,age='"+parseInt(age)+"' ,salary='"+parseInt(salary)+"' , hire_date='"+hire_date+"' where id='"+parseInt(id)+"'",(err,result)=>{
            if(err) {
               res.json({msg:"Something Went wrong"});
               pusher.trigger('channel-test','event-test',{
                msg:'Something Went wrong'
               });
               }else{
                res.json({msg:"Record was updated Successfully",data:data});
                pusher.trigger('channel-test','event-test',{
                    msg:'Record was updated Successfully'
                   });      
            }
        });
});

//to insert only one record to info table
router.post('/info/add',(req,res)=>{
    const name=req.body.name;
    const age=req.body.age;
    const salary=req.body.salary;
    const hire_date=req.body.hire_date;
    const data=[name,parseInt(age),parseInt(salary),hire_date];
        conn.query("insert into info(name,age,salary,hire_date) values('"+name+"','"+parseInt(age)+"','"+parseInt(salary)+"','"+hire_date+"')",(err,result)=>{
            if(err) {
               res.json({msg:"Something Went wrong" + err});
               pusher.trigger('channel-test','event-test',{
                msg:'Something Went wrong' +err
               });
               }else{
                res.json({msg:"Record was added Successfully",data:data});
                pusher.trigger('channel-test','event-test',{
                    msg:'Record was added Successfully'
                   });
                }
        });
});

module.exports= router;
