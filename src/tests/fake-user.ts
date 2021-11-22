import { AuthService } from 'modules/common/auth/auth.service';
import { Role } from 'constants/index';
import { User } from 'modules/crud/users/entities';

const now = new Date();

const fakeUserAdmin = new User();
fakeUserAdmin.userId = 1;
fakeUserAdmin.firstName = 'Admin';
fakeUserAdmin.lastName = 'Admin';
fakeUserAdmin.email = 'admin@gmail.com';
fakeUserAdmin.passwordHash = AuthService.hashPasswordSync('admin');
fakeUserAdmin.roles = [Role.Admin];
fakeUserAdmin.created = now;
fakeUserAdmin.updated = now;

const fakeUser = new User();
fakeUser.userId = 2;
fakeUser.firstName = 'John';
fakeUser.lastName = 'Doe';
fakeUser.email = 'john.doe@gmail.com';
fakeUser.passwordHash = AuthService.hashPasswordSync('123');
fakeUser.roles = [Role.User];
fakeUser.created = now;
fakeUser.updated = now;

export { fakeUserAdmin, fakeUser };
