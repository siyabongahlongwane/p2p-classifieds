import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../configs/firebase"; // Adjust the path to your firebase.js file
import useLoaderStore from "../stores/useLoaderStore";

const useFirebaseStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showLoader, hideLoader } = useLoaderStore();
  /**
   * Upload multiple files to Firebase Storage
   * @param {File[]} files - Array of File objects to upload
   * @param {string} folder - Folder path to save the files in
   * @returns {string[]} - Array of download URLs for the uploaded files
   */
  const uploadFiles = async (files, folder = "classifieds") => {
    if (!files || files.length === 0) {
      throw new Error("No files selected");
    }

    setIsLoading(true);
    setError(null);

    try {
      showLoader();
      const uploadPromises = files.map((file) => {
        const fileRef = ref(storage, `${folder}/${file.name}`);
        return uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef));
      });

      const urls = await Promise.all(uploadPromises);
      setIsLoading(false);
      return urls;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      hideLoader();
      throw err;
    }
  };

  /**
   * Fetch all files from a folder
   * @param {string} folder - Folder path to fetch files from
   * @returns {string[]} - Array of download URLs
   */
  const fetchFiles = async (folder = "classifieds") => {
    const folderRef = ref(storage, folder);
    setIsLoading(true);
    setError(null);

    try {
      showLoader();
      const result = await listAll(folderRef);
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
      setIsLoading(false);
      return urls;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      hideLoader();
      throw err;
    }
  };

  /**
   * Delete a file from Firebase Storage
   * @param {string} filePath - Full path of the file to delete
   */
  const deleteFile = async (filePath) => {
    const fileRef = ref(storage, filePath);
    setIsLoading(true);
    setError(null);

    try {
      showLoader();
      await deleteObject(fileRef);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      hideLoader();
      throw err;
    }
  };

  return {
    uploadFiles, // Updated to handle multiple files
    fetchFiles,
    deleteFile,
    isLoading,
    error,
  };
};

export default useFirebaseStorage;
