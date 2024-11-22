const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const nodemailer = require('nodemailer')
const express = require("express")
const ref = require('./ref')
const cookieParser = require('cookie-parser')
const User = require("../models/user")
const referral = require("../models/referral")
const cloudinary = require("../config/cloudinary")
const upload = require("../middleware/multer")
const message = require('../models/message')


const app = express()

app.use(express.json())
app.use(cookieParser())
dotenv.config()

const { TOKEN_KEY, SMTP_EMAIL, SMTP_PASS } = process.env

let transporter = nodemailer.createTransport({
    host: 'fixtechcare.com',
    port:465,
    secure:true,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASS,
    },
})


app.post('/register', async (req, res) => {
    try {
        const {
            country, category, email, fname, mname, lname, bname, contact, city, state, zip
        } = req.body
        console.log(req.body)

        if (!country || !category || !email || !fname || !lname || !bname || !contact || !city || !state || !zip) {
            return res.status(400).json({ msg: 'Please fill the form completely', status: false })
        }

        const chkuser = await User.findOne({ email })
        if (chkuser) {
            return res.status(400).json({ msg: 'Email already registered with us', status: false })
        }

        const refcode = await ref.gencode()

        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: "Hello there",
            html: `<body>
            <body style="font-family: Arial, sans-serif margin: 0 padding: 0 background-color: #ffffb3">
            <table role="presentation" cellspacing="0" cellpadding="0"  width="600"
            style="margin: 0 auto background-color: #fff padding: 20px border-radius: 5px box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3)">
            <tr>
            <td>
            <h3 style="color: #0838bc font-size: 24px text-align: center margin-bottom: 10px">Welcome To FixTech Care</h3>
            <hr style="border: 1px solid #ccc margin: 20px 0">
            <h4 style="font-size: 20px color: #333">Your Referral ID has been activated now</h4>
            <p style="font-size: 16px color: #333 margin: 20px 0">[When you refer the client dont forget to mention your Referral ID while filling 
                the subscription form]
                </p>
                <p style="font-size: 16px color: #333">Here is your referral code ${refcode}</p>
                <div style="font-size: 16px color: #333 margin-top: 20px text-align: center">
                <h5 style="font-size: 18px">Best Regards</h5>
                <h5 style="font-size: 18px">FixTech Care</h5> 
                </div>
                </td>
                </tr>
                </table>
                </body>
                </body>`,
        }
        await transporter.sendMail(mailOptions);
        console.log("mail sent");

        const newUser = await User.create({
            country, category, email, fname, mname, lname, bname, contact, city, state, zip, refcount: 0, refid: refcode
        });

        res.status(200).json({ status: true, msg: 'User registered successfully check mail for further instruction and unique refer code!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: false, msg: 'Internal server error' });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { refid, rememberMe } = req.body

        if (!refid) {
            return res.json({ msg: 'Please fill the login details completely', status: false })
        }

        const user = await User.findOne({ refid: refid })

        if (!user) {
            return res.json({ msg: 'Invalid credentials', status: false })
        }
        const expiresIn = rememberMe ? '7d' : '2h'
        const token = jwt.sign({ id: user._id, refid }, TOKEN_KEY, { expiresIn })
        return res.status(200).cookie('jwt', token, {
            httpOnly: false,
            maxAge: expiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'None',
        }).cookie('refid', refid, {
            maxAge: expiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
            httpOnly: false,
            // secure: false,
            secure: true,
            sameSite: 'None',
        }).json({
            msg: 'Login successful',
            status: true,
            name:user.fname
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server error', status: false })
    }
})
app.get("/logout", async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.clearCookie('refid');
        return res.status(200).json({msg:"User Logged out and session ended"})
    } catch (ex) {
        next(ex)
    }
})
app.get("/home", auth, (req, res) => {
    res.status(200).send("User Logged in and Session is Active")
})

app.post("/upload", auth, async (req, res) =>
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.log(err)
            return res.status(400).send("Error occured while uploading")
        }
        cloudinary.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                console.log(err)
                return res.status(500).send("Error occured with cloudinary")
            }
            return res.status(200).json({ msg: "Uploaded successfully", imageUrl: result.url })
        })
    })
)

app.post("/icon", auth, async (req, res) => {
    try {
        const existing = await User.findOneAndUpdate({ refid: req.cookies.refid }, { icon: req.body.icon }, { new: true })
        return res.status(200).send("Updated Successfully")
    } catch (error) {
        return res.status(400).send("failed to update")
    }
})
app.post("/user", auth, async (req, res) => {
    try {
        const {refid} = req.body
        const user = await User.findOne({ refid:refid })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).send("failed to fetch")
    }
})
app.patch("/user", auth, async (req, res) => {
    try {
        const {refid,category,bname,email,fname,lname,contact,city,state,zip} = req.body;
        const user = await User.findOneAndUpdate(
            { refid: refid },
            { $set: { category, bname, email, fname, lname, contact, city, state, zip } },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).send("User not found");
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error)
        return res.status(400).send("Failed to update");
    }
});

app.post("/referral", auth, async (req, res) => {
    try {
        const { refid } = req.body
        const chk = await referral.find({ refid: refid })
        if (chk.length == 0)
            return res.status(400).json({ "msg": "No data found" })
        return res.status(200).json(chk)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Cant find appropriate data', status: false })
    }
})
app.post("/commission", auth, async (req, res) => {
    try {
        const { refid } = req.body
        const chk = await referral.find({ refid: refid })
        if (chk.length == 0)
            return res.status(400).json({ "msg": "No data found" })
        return res.status(200).json(chk)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Cant find appropriate data', status: false })
    }
})

app.post('/payout',auth, async (req, res) => {
    const { refid,paymenttype, accountName, accountNum, bankName, bankAddress, swiftCode, ifsc, mobileNum, address, paypalDetail, paymentLink } = req.body;
    console.log(refid)
    try {
        const user = await User.findOneAndUpdate(
            { refid: refid },
            { 
                $set: { 
                    paymenttype: paymenttype, 
                    accountName: accountName, 
                    accountNum: accountNum, 
                    bankName: bankName, 
                    bankAddress: bankAddress, 
                    swiftCode: swiftCode, 
                    ifsc: ifsc, 
                    mobileNum: mobileNum, 
                    address: address, 
                    paypalDetail: paypalDetail, 
                    paymentLink: paymentLink 
                } 
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment info', error: error.toString() });
    }
});

app.get("/notify", auth, async (req, res) => {
    try {
        const refid = req.cookies.refid
        const msg = await message.find({ refid })
        return res.status(200).json(msg)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Cant find appropriate data', status: false })
    }
})

app.post('/mail', upload.single('file'), async(req, res) => {
    const { subject, type, description, otherType } = req.body;
    const file = req.file;
  
    let transporter = nodemailer.createTransport({
        host: 'fixtechcare.com',
        port:465,
        secure:true,
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASS,
        },
    })
  
    let mailOptions = {
      from: SMTP_EMAIL,
      to: 'partner@fixtechcare.com',
      subject: subject,
      text: `Type: ${type}\nDescription: ${description}\nOther Type: ${otherType}`,
      attachments: [
        {
          filename: file.originalname,
          path: file.path
        }
      ]
    };
  
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log(error);
    }
  
    return res.status(200).json({ message: 'Mail sent' });
});

module.exports = app