const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.redirect('/')
        }
        next()
        
    } catch (error) {
         console.log(error.message)
    }
}
const isLogout = async(req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/home-02')
        }
        
        next()
        
    } catch (error) {
         console.log(error.message)
    }
}
const isblock = async(req,res,next)=>{
    try {
        const id =req.session.user_id
        const userData= await userLogout.find({_id:id})
        const info =await userData.find({is_blocked:false})
        if(info){}
        else{
           req.session.distroy()
        }
        next()
        
    } catch (error) {
         console.log(error.message)
    }}
module.exports={

    isLogin ,
    isLogout,
    isblock 


}