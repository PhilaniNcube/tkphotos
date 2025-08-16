import React from "react";

const GalleryPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  return <div>Gallery Page {id}</div>;
};

export default GalleryPage;
