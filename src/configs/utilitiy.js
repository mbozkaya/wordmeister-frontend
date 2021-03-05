const utilitity = {
  authorizedHeader: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` };
    }
    return { 'Content-Type': 'application/json' };
  }
};
export default utilitity;
