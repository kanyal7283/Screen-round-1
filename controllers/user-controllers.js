
const UserModel = require("../model/user-model");
module.exports = {
    addUser: async (req, res) => {
        try {
            //validation for email exist
            let userEmailExist = await UserModel.findOne({ email: req.body.email, status: true });
            if (userEmailExist) return res.status(400).send({ code: 400, success: false, error: false, message: "Email is already exist!" });

            //create new user
            let user = await UserModel.create(req.body);

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "User register successfully",
                data: user
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Something went wrong!" })

        }

    }

}