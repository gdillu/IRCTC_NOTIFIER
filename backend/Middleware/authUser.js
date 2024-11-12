import jwt from "jsonwebtoken";
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token == 'null') {
    return res.redirect(`${frontendUrl}`);
  }
  else{

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  }
  catch (err) {
    res.status(401).json({ msg: 'Bad Request' });
  }
}
};

export default verifyToken;
