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
        const db= await mongoose.connect(process.env.MONGODB_URI||"",{})
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
