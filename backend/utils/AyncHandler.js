
const AyncHandler = (hadleRequest) => {
    return ( req, res, next) => {
        Promise.resolve(hadleRequest(req, res, next)).catch((err) => next(err))
    }
}


export default AyncHandler