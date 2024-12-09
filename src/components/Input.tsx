"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HiOutlinePhotograph } from "react-icons/hi";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

const Input = () => {
  const { data: session } = useSession();
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const imagePickRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  const db = getFirestore(app);

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  const uploadImageToStorage = async () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = selectedFile
      ? new Date().getTime() + "-" + selectedFile.name
      : "";
    const storageRef = ref(storage, fileName);

    if (selectedFile) {
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
          setImageFileUploading(false);
          setImageFileUrl(null);
          setSelectedFile(null);
          location.reload(); // reload the page to show realtime changes after the user posts
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setImageFileUploading(false);
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    setPostLoading(true);
    await addDoc(collection(db, "posts"), {
      uid: session?.user.uid,
      name: session?.user.name,
      username: session?.user.username,
      text,
      profileImg: session?.user.image,
      timestamp: serverTimestamp(),
      image: imageFileUrl,
    });
    setPostLoading(false);
    setText("");
    setImageFileUrl(null);
    setSelectedFile(null);
  };

  if (!session) return null;

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <Image
        src={session.user.image || "/avatar.png"}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          placeholder="Whats happening?"
          rows={2}
        ></textarea>
        {selectedFile && imageFileUrl && (
          <Image
            src={imageFileUrl}
            alt="image"
            width={600}
            height={250}
            className={`w-full max-h-[250px] object-cover cursor-pointer
                ${imageFileUploading ? "animate-pulse" : ""}`}
          />
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={() => {
              if (imagePickRef.current) {
                imagePickRef.current.click();
              }
            }}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            type="file"
            ref={imagePickRef}
            accept="image/*"
            onChange={addImageToPost}
            hidden
          />
          <button
            disabled={(text.trim() === "" || postLoading, imageFileUploading)}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
