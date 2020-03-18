import express from 'express';
import User from '../users/user.entity';
// import User from '../users/user.interface';

interface RequestWithUser extends express.Request {
  user?: User
}

export default RequestWithUser;