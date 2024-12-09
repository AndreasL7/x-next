"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  HiOutlineChat,
  HiOutlineHeart,
  HiHeart,
  HiOutlineTrash,
} from "react-icons/hi";
import { app } from "../firebase";
import {
  doc,
  getFirestore,
  setDoc,
  serverTimestamp,
  onSnapshot,
  collection,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

const Icons = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return () => unsubscribe();
  }, [db, id]);

  useEffect(() => {
    setIsLiked(likes.findIndex((like) => like.id === session?.user.uid) !== -1);
  }, [likes, session?.user?.uid]);

  const likePost = async () => {
    if (!session?.user?.uid) {
      console.error("User UID is undefined. Cannot like or unlike a post.");
      return;
    }

    if (session) {
      const docRef = doc(db, "posts", id, "likes", session.user.uid);
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

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100" />

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

      <HiOutlineTrash className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100" />
    </div>
  );
};

export default Icons;
