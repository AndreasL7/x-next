import React from "react";
import { app } from "@/firebase";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import Post from "@/components/Post";
import Comments from "@/components/Comments";

interface PostPageProps {
  params: {
    id: string;
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const db = getFirestore(app);
  const paramsAwaited = await params;

  const querySnapshot = await getDoc(doc(db, "posts", paramsAwaited.id));

  if (!querySnapshot.exists()) {
    throw new Error(`Post with ID ${paramsAwaited.id} not found`);
  }

  const data = { ...(querySnapshot.data() as Post), id: querySnapshot.id };

  return (
    <div className="max-w-xl mx-auto border-r border-l min-h-screen">
      <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <Link href={"/"} className="hover:bg-gray-100 rounded-full p-2">
          <HiArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="sm:text-lg">Back</h2>
      </div>
      <Post post={data} id={data.id} />
      <Comments id={params.id} />
    </div>
  );
};

export default PostPage;
