// eslint-disable-next-line import/prefer-default-export
export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({
      message: 'Unauthorization',
    });
  }
};
