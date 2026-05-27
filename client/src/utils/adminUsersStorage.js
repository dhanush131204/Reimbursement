const ADMIN_USERS_KEY = 'adminUsers';

export const getAdminUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

export const saveAdminUsers = (users) => {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
};

export const upsertAdminUser = (user) => {
  const users = getAdminUsers();
  const existingIndex = users.findIndex((item) => String(item.id) === String(user.id));
  const nextUser = {
    ...user,
    id: user.id || Date.now(),
  };

  const nextUsers =
    existingIndex >= 0
      ? users.map((item, index) => (index === existingIndex ? nextUser : item))
      : [nextUser, ...users];

  saveAdminUsers(nextUsers);
  return nextUser;
};
