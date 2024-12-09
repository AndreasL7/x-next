"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HiDotsHorizontal, HiHeart, HiOutlineHeart } from "react-icons/hi";
import {
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { app } from "@/firebase";
import { signIn, useSession } from "next-auth/react";

interface CommentProp {
  comment: {
    name: string;
    username: string;
    userImg: string;
    text: string;
    comment: string;
  };
  commentId: string;
  originalPostId: string;
}

const Comment = ({ comment, commentId, originalPostId }: CommentProp) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const { data: session } = useSession();
  const db = getFirestore(app);

  const likePost = async () => {
    if (!session?.user?.uid) {
      console.error("User UID is undefined. Cannot like or unlike a post.");
      return;
    }

    if (session) {
      const docRef = doc(
        db,
        "posts",
        originalPostId,
        "comments",
        commentId,
        "likes",
        session.user.uid
      );
      if (isLiked) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          username: session.user.username,
          timestamp: serverTimestamp(),
        });
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", originalPostId, "comments", commentId, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    setIsLiked(likes.findIndex((like) => like.id === session?.user.uid) !== -1);
  }, [likes]);

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

        <div className="flex items-center">
          {isLiked ? (
            <HiHeart
              onClick={likePost}
              className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100 text-red-600"
            />
          ) : (
            <HiOutlineHeart
              onClick={likePost}
              className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
            />
          )}
          {likes.length > 0 && (
            <span className={`text-xs ${isLiked && "text-red-600"}`}>
              {likes.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
