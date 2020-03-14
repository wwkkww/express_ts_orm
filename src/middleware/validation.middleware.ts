import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';
import HttpException from '../exceptions/HttpException';

/**
 * Ref: class-validator Option
 * interface ValidatorOptions {
    skipMissingProperties?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
    groups?: string[];
    dismissDefaultMessages?: boolean;
    validationError?: {
        target?: boolean;
        value?: boolean;
    };
    forbidUnknownValues?: boolean;
}
 */


function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body))
      .then((validationErrors: ValidationError[]) => {
        console.log(validationErrors)
        // [ValidationError {
        //   target: CreatePostDto {
        //     author: 123,
        //     content: true,
        //     title: 'My Third Post'
        //   },
        //   value: true,
        //   property: 'content',
        //   children: [],
        //   constraints: { isString: 'content must be a string' }
        // }, {}, {}]
        if (validationErrors.length > 0) {
          const message: any = validationErrors.map((error: ValidationError) => Object.values(error.constraints)).join(", ");
          console.log('message', message)
          next(new HttpException(400, message))
        } else {
          next();
        }
      })
  }

}

function validationPatchMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties: true })
      .then((validationErrors: ValidationError[]) => {
        console.log(validationErrors)
        // [ValidationError {
        //   target: CreatePostDto {
        //     author: 123,
        //     content: true,
        //     title: 'My Third Post'
        //   },
        //   value: true,
        //   property: 'content',
        //   children: [],
        //   constraints: { isString: 'content must be a string' }
        // }, {}, {}]
        if (validationErrors.length > 0) {
          const message: any = validationErrors.map((error: ValidationError) => Object.values(error.constraints)).join(", ");
          console.log('message', message)
          next(new HttpException(400, message))
        } else {
          next();
        }
      })
  }

}

export { validationMiddleware, validationPatchMiddleware };