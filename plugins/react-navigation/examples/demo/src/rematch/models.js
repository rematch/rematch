export const auth = {
  state: {
    isLoggedIn: false,
  },
  reducers: {
    login: () => ({
      isLoggedIn: true,
    }),
    logout: () => ({
      isLoggedIn: false,
    }),
  }
}
