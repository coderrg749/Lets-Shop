const User = require('../models/user')
const userSchema = require('../views/userSchema')
const asyncHandler = require('express-async-handler')
const { generateToken, verifyToken } = require('../helpers/jwtToken')
const validateId = require('../helpers/validateMongoId')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { generateRefreshToken } = require('../helpers/refreshToken')
const sendEmail = require('./emailController')
const UserController = {}
//REGISTER USER-------------------------------------------------------------------------------------------->
UserController.createUser = asyncHandler(async (req, res) => {
    const { error, value } = userSchema.registerSchema.validate(req.body)

    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    const { email } = value;
    const user = await User.findOne({ email })

    if (!user) {
        const newUser = await User.create(value)
        return res.status(200).json(newUser)
    } else {
        throw new Error('User Already Exists')
    }
})

//Login Route------------------------------------------------------------------------------------------->
UserController.login = asyncHandler(async (req, res) => {
    const { error, value } = userSchema.loginSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    const { email, password } = value
    const user = await User.findOne({ email })
    if (user && (await user.isPasswordMatched(password))) {

        const refreshToken = generateRefreshToken(user?._id);
        console.log(refreshToken);
        const updateUser = await User.findByIdAndUpdate(user?._id, { refreshToken: refreshToken }, { new: true });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.json({
            // _id:user?._id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            token: generateToken(user?._id, email),
        })
    } else {
        throw new Error('Invalid Credentials')
    }
})
//Handle refreshtoekn

UserController.handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});
// Logout hqandler

UserController.logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.status(204)
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204)
})

// GET ALL USERS------------------------------------------------------------------------------------------->
UserController.allUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        if (users.length !== 0) {
            res.status(200).json(users)
        } else {
            res.status(400).json({ message: 'No users' })
        }
    } catch (err) {
        throw new Error(err)
    }
})

// GET SINGLE USER------------------------------------------------------------------------------------------->
UserController.singleUser = asyncHandler(async (req, res) => {
    try {
        let id = req.params.id;
        let _id = req.user;
        validateId(id);
        const singleUser = await User.findById(id)
        if (singleUser) {
            res.status(200).json(singleUser)
        } else {
            res.status(400).json({ message: 'No user was found' })
        }
    } catch (err) {
        throw new Error(err)
    }
})

// DELETE USER------------------------------------------------------------------------------------------->
UserController.deleteUser = asyncHandler(async (req, res) => {
    try {
        let id = req.params.id;
        validateId(id);
        const deletedUser = await User.findByIdAndRemove(id)
        if (deletedUser) {
            res.status(200).json({
                message: 'User deleted',
                email: deletedUser.email,
            })
        } else {
            res.status(400).json({ message: 'No user was deleted' })
        }
    } catch (err) {
        throw new Error(err)
    }
})

// UPDATE USER ROUTE
UserController.updateUser = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        validateId(_id);
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        )
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

//ADMIN ***************************************************

// BLOCK USER ------------------------------------------------------------------------------------------->
UserController.blockUser = asyncHandler(async (req, res) => {
    let id = req.params.id;
    validateId(id);
    const blockUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
    )
    if (blockUser) {
        res.status(200).json({ message: 'user Blocked', user: blockUser })
    } else {
        throw new Error("User unable to unbloack");
    }
})

//UNBLOCK USER------------------------------------------------------------------------------------------->
UserController.unblockUser = asyncHandler(async (req, res) => {
    let id = req.params.id;
    validateId(id);
    // console.log(id)
    const unblockUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
    )
    if (unblockUser) {
        res.status(200).json({ message: 'user UnBlocked', user: unblockUser })
    } else {
        throw new Error("User unable to unbloack");
    }
})
//UPDATE  A PASSWORD
UserController.updatePassword = asyncHandler(
    async (req, res) => {
        const { _id } = req.user;
        console.log(req.user)
        const { password } = req.body;
        validateId(_id);
        const user = await User.findById(_id);
        if (user) {
            if (password) {
                user.password = password;
                const updatedPassword = await user.save();
                if (updatedPassword) {
                    return res.status(201).json({ message: "Password updated succesfully" });
                } else {
                    throw new Error('Unable To Update The Password')
                }
            } else {
                throw new Error('Please enter a valid Password')
            }
        } else {
            throw new Error('Invalid Id');
        }
    }
)

// FORGOT PASSWORD RESET TOKEN GENERATION
UserController.forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error("user not found with this email")
    }
    try {
        const token = await user.createPasswordResetToken();
        if (!token) {
            throw new Error("Token  cant be created")
        }
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        // sendEmail(data);
        res.json(token);
    } catch (err) {
        throw new Error(err);
    }



})

// RESET PASSWORD
UserController.resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });

  //ADD TO WISHLIST
  UserController.addToWishlist = asyncHandler(async (req, res) => {
    try {
        let { _id } = req.user
        validateId(_id)
        let { prodId } = req.body
        validateId(prodId)
        let user = await User.findById(prodId)
        if (user) {
            const alreadyAdded = user?.wishlist.find(
                (id) => id.toString() === prodId.toString()
            )
            if (alreadyAdded) {
                // remove it
                let updatedWishlist = await User.findByIdAndUpdate(
                    _id,
                    {
                        $pull: { wishlist: prodId },
                    },
                    { new: true }
                )
                res.status(200).json(updatedWishlist)
            } else {
                // add to it
                let updatedWishlist = await User.findByIdAndUpdate(
                    _id,
                    {
                        $push: { wishlist: prodId },
                    },
                    { new: true }
                )
                res.status(200).json(updatedWishlist)
            }
        } else {
            res.status(400).send('User cant be found with the given id')
        }
    } catch (err) {
        throw new Error(err)
    }
})


module.exports = UserController
