import axios from "axios";

export const api = axios.create({

 baseURL:"https://api.example.com",//change to correct backend url

 headers:{
  "Content-Type":"application/json"
 }

});