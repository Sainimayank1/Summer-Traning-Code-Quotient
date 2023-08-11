
async function Dashboard (req, res){
    if (req.session.isLoggedIn) {
        try {
            res.render("dashboard", { username: req.session.username, isAdmin: req.session.isAdmin })
        } catch (error) {
            res.redirect("/login")
        }
    }
    else
    res.redirect("/login")
}

export default Dashboard