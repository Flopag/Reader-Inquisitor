jest.mock('@models/user', () => ({
    findByPk: jest.fn()
}));

const User = require('@models/user');

describe('Auth flow', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('User is correctly serialized then deserialized', done => {
        const passport = require('@app/auth/oauth2_discord');
        const fakeUser = { user_id: 1, discord_id: 2, role_name: "test" };
        User.findByPk.mockResolvedValue(fakeUser);

        passport.serializeUser(fakeUser, (err, id) => {
            try{
                expect(err).toBeNull();
                expect(id).toBe(fakeUser.user_id);

                passport.deserializeUser(1,(err, user) => {
                    try {
                        expect(err).toBeNull();
                        expect(user).toBe(fakeUser);
                        expect(User.findByPk).toHaveBeenCalledWith(fakeUser.user_id);

                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            } catch (err) {
                done(err);
            }
            
        });
    });
});