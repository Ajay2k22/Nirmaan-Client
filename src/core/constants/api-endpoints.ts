import { environment } from '../../environments/environment.prod';

export const _BASE_URL = environment.API_URL;

// export const API_ENDPOINTS = {
//   AUTH: {
//     LOGIN: `${_BASE_URL}/Admin/login`,
//     REGISTER: `${_BASE_URL}/Admin/register`,
//   },
//   COMPLAINTS: {
//     GET_ALL_COMPLAINTS: `${_BASE_URL}/Admin/getAllComplaints`,
//     COMPLAINTS_BY_ID: `${_BASE_URL}/Admin/complaints`,
//     GET_ALL_MASTERDATA: `${_BASE_URL}/Admin/getAllMasterData`,
//     UPDATE_STATUS: `${_BASE_URL}/Admin/updateComplaintStatus`,
//     RESOLVE: `${_BASE_URL}/Admin/reolve`,
//   },
// } as const;
