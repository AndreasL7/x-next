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
import { modalState, postIdState } from "@/atom/modalAtom";
import { useRecoilState } from "recoil";

const Icons = ({ id, uid }: { id: string; uid: string }) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
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

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      if (session?.user?.uid === uid) {
        deleteDoc(doc(db, "posts", id))
          .then(() => {
            console.log("Document successfully deleted!");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      } else {
        alert("You can only delete your own posts.");
      }
    }
  };

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat
        className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"
        onClick={() => {
          if (!session) {
            signIn();
          } else {
            setOpen(!open);
            setPostId(id);
          }
        }}
      />

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

      {session?.user?.uid === uid && (
        <HiOutlineTrash
          className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          onClick={deletePost}
        />
      )}
    </div>
  );
};

export default Icons;
