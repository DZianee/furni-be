const httpErrorRequest = {
    serverError: (res, error)=>{
        res.status(500).send({message: error.message})
    },
    badRequest: (res, error)=>{
        res.status(400).send({message: error.message.split(",")})
    },
    notFound: (res, error, text)=>{
        res.status(404).send({message: `This ${text} cannot be found`})
    },
    notAuth: (res)=>{
        res.status(401).send({message: "You are not authenticated"})
    },
    forbidden: (res, error)=>{
        res.status(403).send({message: error.message})
    },
}

module.exports = httpErrorRequest