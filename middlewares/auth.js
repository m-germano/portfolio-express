const jwt = require("jsonwebtoken");

// Middleware: Verifica se o usuário está autenticado
function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.redirect("/login"); // ou res.status(401).send("Não autenticado");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("accessToken");
    return res.redirect("/login");
  }
}

// Middleware: Verifica se o usuário autenticado é admin
function requireAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).send("Acesso restrito ao administrador.");
}

module.exports = {
  authenticateToken,
  requireAdmin,
};
