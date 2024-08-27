declare global {
  namespace Express {
    interface Request {
      User: {
        userId: string;
      };
    }
  }
}
