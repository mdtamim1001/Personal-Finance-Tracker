import { UserPayload } from '../../auth/types/user-payload.interface'; // or wherever you define payload

declare module 'express' {
  interface Request {
    user: UserPayload;
  }
}
