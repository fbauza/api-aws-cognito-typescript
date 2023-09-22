import { Handler, Request } from "express";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const identityServiceProvider = new CognitoIdentityServiceProvider({
  region: process.env.REGION || "sa-east-1",
});

export interface IUser {
  id: string;
  email: string;
}

export interface IPerson {
  firstName: string;
  lastName: string;
}

export interface IAuthenticatedRequest extends Request {
  user?: IUser;
  // comentario prueba github
  // comentario segundo
  // comenatorio tercero
  // Agrego nombre y apellido
  person?: IPerson;
}

/*
req {
  user {
    id: 1
    email: abc@gmail.com
  }
  person {
    fistName: "Fabian"
    lastNAme: "Bauza"
  }
}
*/

const authMiddleware: Handler = async (
  req: IAuthenticatedRequest,
  res,
  next
) => {
  try {
    const namePerson = req.person?.firstName;
    console.log("namePerson", namePerson);

    const token = req.headers["authorization"]!;
    const rawUser = await identityServiceProvider
      .getUser({ AccessToken: token })
      .promise();
    req.user = {
      id: rawUser.UserAttributes.find((attr) => attr.Name === "sub")?.Value!,
      email: rawUser.UserAttributes.find((attr) => attr.Name === "email")
        ?.Value!,
    };
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
