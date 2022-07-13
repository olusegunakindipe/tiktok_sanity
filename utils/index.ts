import axios from 'axios';
import jwt_decode from 'jwt-decode';

interface IProps {
  name: string;
  picture: string;
  sub: string;
}
export const createOrGetUser = async (response: any, addUser: any) => {
  const decoded: IProps = jwt_decode(response.credential);

  const { name, picture, sub } = decoded;

  const user = {
    _id: sub,
    _type: 'user',
    username: name,
    image: picture,
  };

  addUser(user);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
  };
  await axios.post(`http://localhost:3000/api/auth`, user, {
    headers,
  });
};
