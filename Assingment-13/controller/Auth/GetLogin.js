function GetLogin (req, res) {
    if (req.session.isLoggedIn)
        res.redirect("/dashboard")
    else
        res.render("login");
}

export default GetLogin