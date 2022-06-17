const httpErrorRequest = {
    serverError: (res, error)=>{
        res.status(500).send({message: error.message})
    },
    badRequest: (res, error)=>{
        res.status(400).send({message: error.message.split(",")})
    },
    notFound: (res)=>{
        res.status(404)
    },
    notAuth: (res, error)=>{
        res.status(401).send({message: "You are not authenticated"})
    },
    forbidden: (res, error)=>{
        res.status(403).send({message: error.message})
    },
}

module.exports = httpErrorRequest