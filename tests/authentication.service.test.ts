import typeorm, { getRepository } from 'typeorm';
import AuthenticationService from "../src/authentication/authentication.service"
import TokenData from "../src/interfaces/tokenData.interface"
import CreateUserDto from "../src/users/user.dto"
import EmailAlreadyExistsException from '../src/exceptions/EmailAlreadyExistException'


describe('The authentication service', () => {
  describe('when creating a cookie', () => {
    const tokenData: TokenData = {
      token: '',
      expiresIn: 1
    }
    it("should return a string", () => {
      const authenticationService = new AuthenticationService()
      expect(typeof authenticationService.createCookie(tokenData)).toEqual('string')
    })
  })
})

describe('The AuthenticationService', () => {
  describe('when registering a user', () => {
    describe('if the email is already taken', () => {
      it('should throw an error', async () => {
        const userData: CreateUserDto = {
          fullName: 'Steve',
          email: 'steve@example.com',
          password: 'password',
        };
        // (typeorm as any).getRepository.mockReturnValue({
        //   findOne: () => Promise.resolve(userData),
        // });
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.register(userData))
          .rejects.toMatchObject(new EmailAlreadyExistsException(userData.email));
      });
    });
  });
});