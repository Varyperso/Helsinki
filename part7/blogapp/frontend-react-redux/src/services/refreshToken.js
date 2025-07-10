const baseUrl = '/refreshToken'
import api from './api'

export const refreshToken = async (token) => {
  const response = await api.post(baseUrl);
  return response.data.token;
};

export default { refreshToken }