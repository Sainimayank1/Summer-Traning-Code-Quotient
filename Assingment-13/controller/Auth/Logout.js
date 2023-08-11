
function Logout (req, res)  {
    if (req.session.isLoggedIn) {
        req.session.destroy((err) => {
            if (!err)
                res.redirect("/login")
        })
    }
}

export default Logout