import axios, { AxiosRequestConfig, Method, ResponseType } from "axios";

export const axiosInstance = axios.create({});

interface ApiConnectorParams {
  method: Method;
  url: string;
  bodyData?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  responseType?: ResponseType;  // Add this line
}

export const apiConnector = ({
  method,
  url,
  bodyData,
  headers,
  params,
  responseType,  // Add this line
}: ApiConnectorParams) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData || undefined,
    headers: headers || undefined,
    params: params || undefined,
    responseType: responseType || undefined,  // Add this line
  };

  return axiosInstance(config);
};