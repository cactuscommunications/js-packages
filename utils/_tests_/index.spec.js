import * as main from "../index";

const testConfig = {
  clientId: "14",
  issuer: "http://local.accounts.editage.com",
  authorizeUrl: "oauth/authorize",
  responseType: "code",
  redirectUri: "http://localhost:4200",
  scope: "openid email phone alias profile offline_access",
  tokenVariable: "access_token",
  preferredStorage: "local",
};

describe("Utilities testing suite", () => {
  test("should encode object in valid url format skipping empty params", () => {
    const config = {
      ...testConfig,
    };
    config.clientId = "";
    const expected =
      "issuer=http%3A%2F%2Flocal.accounts.editage.com&authorizeUrl=oauth%2Fauthorize&responseType=code&redirectUri=http%3A%2F%2Flocalhost%3A4200&scope=openid%20email%20phone%20alias%20profile%20offline_access";
    expect(main.encodeURIQuery(config)).toMatch(expected);
  });
  test("should encode object in valid url format", () => {
    const expected =
      "clientId=14&issuer=http%3A%2F%2Flocal.accounts.editage.com&authorizeUrl=oauth%2Fauthorize&responseType=code&redirectUri=http%3A%2F%2Flocalhost%3A4200&scope=openid%20email%20phone%20alias%20profile%20offline_access";
    expect(main.encodeURIQuery(testConfig)).toMatch(expected);
  });
  test("should return string", () => {
    expect(
      main.base64encodeURIComponent(`${testConfig.issuer}?parm=a&two=2%20+22`)
    ).not.toEqual("");
  });
  test("should return random characters", () => {
    expect(main.random("5")).not.toEqual("");
  });
  test("should return string with replaced characters", () => {
    const expected = "http:__local.accounts.editage.com_d?parm=a&two=2%20-22";
    const input = `${testConfig.issuer}/d?parm=a&two=2%20+22`;
    spyOn(window, "btoa").and.returnValue(input);
    // added spy just because the condition being checked is very rare which involes b64 with + sign (https://stackoverflow.com/a/22108380)
    // other condition is checked in previous test
    const actual = main.base64encodeURIComponent(input);
    expect(actual === expected).toBeTruthy();
  });
});
