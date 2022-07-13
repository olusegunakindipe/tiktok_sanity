import Image from 'next/image';
import React from 'react';
import { GoVerified } from 'react-icons/go';

interface IProp {
  image: string;
  name: string;
  comment?: string;
  caption?: string;
}
const Likes = ({ image, name, comment, caption }: IProp) => {
  return (
    <>
      <div className="likes">
        <Image src={image} className="image" width={62} height={62} alt="" />
        <div className="username">
          <span className="first">{name}</span>{' '}
          <GoVerified className="verified" />
          <p className="second">{comment ? comment : name}</p>
        </div>
      </div>
      <div className="caption">{caption}</div>
    </>
  );
};

export default Likes;
