import joi from 'joi'

const transactionSchema = joi.object({
    value: joi.number().min(0.01).max(1000000000).required(),
    description: joi.string().min(3).max(50).required(),
    entry: joi.boolean().required(),
})

export {
    transactionSchema,
}
