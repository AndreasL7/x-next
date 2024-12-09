"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiDotsHorizontal } from "react-icons/hi";

interface CommentProp {
  comment: {
    name: string;
    username: string;
    userImg: string;
    text: string;
    comment: string;
  };
  id: string;
}

const Comment = ({ comment, id }: CommentProp) => {
  return (
    <div className="flex p-3 border-b border-gray-200 hover:bg-gray-50 pl-10">
      <Image
        src={comment?.userImg || "/avatar.png"} // Fallback to "/avatar.png" if profileImg is missing
        width={44}
        height={44}
        alt="user-img"
        className="h-9 w-9 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-sm truncate">{comment?.name}</h4>
            <span className="text-xs truncate">@{comment?.username}</span>
          </div>
          <HiDotsHorizontal className="text-sm" />
        </div>
        <p className="text-gray-800 text-xs my-3">{comment?.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
