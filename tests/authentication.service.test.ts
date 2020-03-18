import AuthenticationService from "../src/authentication/authentication.service"
import TokenData from "../src/interfaces/tokenData.interface"


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
