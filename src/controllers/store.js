import Store from "../models/store"

// eslint-disable-next-line import/prefer-default-export
export const createStore = async (request,response)=>{
    try {
        const store = await new Store(request.body).save()
        response.json(store)
    } catch (error) {
        response.status(400).json({message:"Không thể thêm cửa hàng"})
        console.log(error);
    }
}
export const listStore = async (request,response)=>{
    try {
        const store = await Store.find({}).exec()
        response.json(store);
    } catch (error) {
        response.status(400).json({message:"Không hiển thị được cửa hàng"})
    }
}
export const listStoreDetail = async (request,response)=>{
    try {
        const store = await Store.findOne({_id:request.params.id}).exec()
        response.json(store);
    } catch (error) {
        response.status(400).json({message:"Không tìm thấy data"})
    }
}
export const deleteStore = async (request,response)=>{
    try {
        const store = await Store.findOneAndDelete({_id:request.params.id}).exec()
        response.json(store);
    } catch (error) {
        response.status(400).json({message:"Không thể xóa cửa hàng"})
        
    }
}
export const updateStore = async (request,response)=>{
    const option = {new: true}
    try {
        const store = await Store.findOneAndUpdate({id:request.params.id}, request.body, option).exec()
        response.json(store);
    } catch (error) {
        response.status(400).json({message:"Không cập nhật được"})   
    }
}
