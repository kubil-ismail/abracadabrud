import nookies from 'nookies';

const getCredential = ({ req }) => {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const isAuthenticated = !!token;
    const userId = cookies.userId;
    const _userId = cookies._userId;
    const payment = cookies.payment
    const _token = cookies._token;

    return { isAuthenticated, token, userId, payment, _userId, _token };
}

export default getCredential;