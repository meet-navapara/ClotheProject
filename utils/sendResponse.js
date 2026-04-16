module.exports = (
    res,
    statusCode = 200,
    success = true,
    message = "",
    data = null
) => {
    const response  = {
        success,
        message,
    };

    if(data !== null)
    {
        response.data =  data;
    }

    return res.status(statusCode).json(response);
}