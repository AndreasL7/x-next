import React from "react";
import Image from "next/image";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

interface Post {
  id: string;
  image: string;
  name: string;
  profileImg: string;
  text: string;
  timestamp: Timestamp;
  uid: string;
  username: string;
}

interface PostProps {
  post: Post;
  id: string;
}

const Post = ({ post, id }: PostProps) => {
  return (
    <div className="flex p-3 border-b border-gray-200">
      <Image
        src={post?.profileImg || "/avatar.png"} // Fallback to "/avatar.png" if profileImg is missing
        width={44}
        height={44}
        alt="user-img"
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-xs truncate">{post?.name}</h4>
            <span className="text-xs truncate">@{post?.username}</span>
          </div>
          <HiDotsHorizontal className="text-sm" />
        </div>
        <Link href={`/post/${id}`}>
          <p className="text-gray-800 text-sm my-3">{post?.text}</p>
        </Link>

        <Link href={`/post/${id}`}>
          <Image
            src={post?.image || "/placeholder.png"} // Fallback to "/placeholder.png" for missing post images
            width={400}
            height={200}
            alt="post-img"
            className="rounded-2xl mr-2"
          />
        </Link>
      </div>
    </div>
  );
};

export default Post;
