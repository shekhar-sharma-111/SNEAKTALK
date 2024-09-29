import mongoose from "mongoose";
type ConnectionObject={
    isConnected?:number;
}
const connection:ConnectionObject={}
async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log('db connected')
        return
    }
    try{
        const db= await mongoose.connect(process.env.MONGODB_URI||"mongodb+srv://Shekhar:Shekhar7206@cluster0.z1lxhch.mongodb.net/feedbackApp?retryWrites=true&w=majority&appName=Cluster0",{})
        connection.isConnected=db.connections[0].readyState
        console.log(db.connection.get)
        console.log("DB connected successfully")
    }
    catch(err){
        console.error(err);
        console.log(" DB connection failed")
        process.exit(1)
    }

}

export default  dbConnect ;