import jwt from "jsonwebtoken";
import { User } from "../../models/User";

export async function socketAuthMiddleware(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication required"));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }

    const user = await User.findById(decodedToken?._id).select(
      "_id username"
    );

    if (!user) {
      return next(new Error("Authentication required"));
    }

    socket.user = {
      id: user._id.toString(),
      username: user.username,
    };

    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
}

