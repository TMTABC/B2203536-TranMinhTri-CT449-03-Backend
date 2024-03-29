const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongo.utils");

// Create and Save a new Contact
exports.create = async(req,res,next)=>{
    if(!req.body?.name){
        return next(new ApiError(400,"Name can not be empty"));
    }
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    }catch(err){
        console.log(err)
        return next(new ApiError(500,"A error occurred while creating the contact"));
    };
}

//Retrieve all contact of user from the database
exports.findAll = async(req,res,next)=>{
    let documents = [];
    try{
        const contactService = new ContactService(MongoDB.client);
        const {name} =req.query;
        if(name){
            documents = await contactService.findByName(name);
        }else{
            documents = await contactService.find({});
        }
    }catch(err){
        return next(
            new ApiError(500,"A error occurred while retrieving the contact")
        )
    }
    return res.send(documents);
}

//Find a single contact with id
exports.findOne = async(req,res,next)=>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404,"Contact no found"));
        }
        res.send(document);
    }catch(err){
        return next(
            new ApiError(500,`Error retrieving contact with id=${req.params.id}`)
        )
    }
}

//Update a contact by the id in the request
exports.update = async(req,res,next)=>{
    if(Object.keys(req.body).length===0){
        return next(new ApiError(400,"Data to update can not be empty"));
    }
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id,req.body);
        if(!document){
            return next(new ApiError(404,"Contact not found"));
        }
        res.send({message: "Contact was updated successfully"});
    }catch(err){
        return next(new ApiError(500,`Error updating contact with id=${req.params.id}`))
    };
}

//Delete a contact with the specified in the request
exports.delete = async(req,res,next)=>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404,"Contact not found"));
        }
        return res.send({message:"Contact was deleted successfuly"});
    }catch(err){
        return next(new ApiError(500,`Could not delete contact with id=${req.params.id}`))
    }
}

//Delete all contacts of a user from the database
exports.deleteAll = async(req,res,next)=>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll(); 
        console.log(deletedCount);
        res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    }catch(err){
        return next(new ApiError(500,`An error occurred while removing all contacts`))
    }
}

//Find all favorite contacts of a user
exports.findAllFavorite = async(req,res,next)=>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite(); 
        res.send(documents);
    }catch(err){
        return next(new ApiError(500,`An error occurred while retrieving favorite contacts`))
    }
}