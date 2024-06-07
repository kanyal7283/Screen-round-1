

const validateRequest = (schema) => {
    return async (req, res, next) => {

        let input = { ...req.body, ...req.query, ...req.params };

        // Validate the input against the specified Joi schema
        const { error } = schema(req.__).validate(input);

        // If validation fails, return a bad data response with the first validation error message
        if (error) {
            const errorMessage = error.details[0].message;
            return res.status(404).send({
                code: 404,
                success: false,
                error: false,
                message:errorMessage
            });
        }
        next();
    }
}

module.exports = { validateRequest }