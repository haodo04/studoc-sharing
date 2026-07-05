import axios from "axios";
import apiEndpoints from "./apiEndpoint";

const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const collectionApi = {
  list: (token) => axios.get(apiEndpoints.GET_COLLECTIONS, authHeaders(token)),

  getDetail: (collectionId, token) =>
    axios.get(apiEndpoints.GET_COLLECTION_DETAIL(collectionId), authHeaders(token)),

  getCollectionsContainingFile: (fileId, token) =>
    axios.get(apiEndpoints.GET_COLLECTIONS_CONTAINING_FILE(fileId), authHeaders(token)),

  create: (name, token) =>
    axios.post(apiEndpoints.CREATE_COLLECTION, { name }, authHeaders(token)),

  rename: (collectionId, name, token) =>
    axios.patch(apiEndpoints.RENAME_COLLECTION(collectionId), { name }, authHeaders(token)),

  remove: (collectionId, token) =>
    axios.delete(apiEndpoints.DELETE_COLLECTION(collectionId), authHeaders(token)),

  addFile: (collectionId, fileId, token) =>
    axios.post(apiEndpoints.ADD_FILE_TO_COLLECTION(collectionId, fileId), {}, authHeaders(token)),

  removeFile: (collectionId, fileId, token) =>
    axios.delete(apiEndpoints.REMOVE_FILE_FROM_COLLECTION(collectionId, fileId), authHeaders(token)),
};